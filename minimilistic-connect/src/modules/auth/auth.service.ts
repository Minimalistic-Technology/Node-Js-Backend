import { env } from '@/config';
import { AppError } from '@/core/AppError';
import { auditService } from '@/services/audit.service';
import { emailService } from '@/services/email.service';
import { passwordService } from '@/services/password.service';
import { tokenService } from '@/services/token.service';
import User from '@/models/User.model';
import { AuditEventType } from '@/models/AuditLog.model'; // Corrected import path
import { Document } from 'mongoose';
import {
  AuthTokens,
  LoginInput,
  SignupInput,
} from '@/modules/auth/auth.types';

// Helper to generate full token response
const generateAuthResponse = async (
  user: Document & { id: string; email: string; emailVerified: boolean; }, // Refined User type
  ip?: string,
  userAgent?: string
): Promise<AuthTokens> => {
  const accessToken = tokenService.generateAccessToken(user);
  const { token: refreshToken } = await tokenService.generateAndStoreRefreshToken(
    user.id,
    ip,
    userAgent
  );

  return {
    accessToken,
    accessExpiresIn: env.ACCESS_TOKEN_EXP,
    refreshToken,
    refreshExpiresIn: env.REFRESH_TOKEN_EXP,
  };
};

export const authService = {
  /**
   * 1. Signup
   */
  signup: async (input: SignupInput) => {
    const existingUser = await User.findOne({ email: input.email });

    if (existingUser) {
      throw new AppError(409, 'AUTH_EMAIL_IN_USE', 'Email already in use');
    }

    const { hash, algo } = await passwordService.hash(input.password);

    const user = await User.create({
      email: input.email,
      name: input.name,
      passwordHash: hash,
      passwordAlgo: algo,
      emailVerified: false, // Must verify
    });

    // Send verification email
    const verificationToken =
      await tokenService.generateEmailVerificationToken(user.id);
    
    // Use a stub for now
    // await emailService.sendVerificationEmail(user.email, verificationToken);
    console.log(`Verification token for ${user.email}: ${verificationToken}`);


    await auditService.log({
      userId: user.id,
      eventType: AuditEventType.SIGNUP,
    });

    return { id: user.id, email: user.email, verified: user.emailVerified };
  },

  /**
   * 2. Verify Email
   */
  verifyEmail: async (token: string) => {
    const dbToken = await tokenService.findEmailToken(token);

    if (
      !dbToken ||
      dbToken.consumed ||
      dbToken.expiresAt < new Date()
    ) {
      throw new AppError(
        400,
        'VERIFICATION_INVALID_OR_EXPIRED',
        'Verification token is invalid or has expired'
      );
    }

    await User.findByIdAndUpdate(dbToken.userId, { emailVerified: true });
    await tokenService.consumeEmailToken(dbToken.id);

    await auditService.log({
      userId: dbToken.userId,
      eventType: AuditEventType.VERIFICATION_SUCCESS,
    });

    return { message: 'Email verified successfully' };
  },

  /**
   * 3. Login
   */
  login: async (
    input: LoginInput,
    ip?: string,
    userAgent?: string
  ): Promise<AuthTokens> => {
    const user = await User.findOne({ email: input.email });

    if (!user) {
      throw new AppError(
        401,
        'AUTH_INVALID_CREDENTIALS',
        'Invalid email or password'
      );
    }

    // Check account lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new AppError(
        403,
        'AUTH_ACCOUNT_LOCKED',
        'Account is locked. Try again later.'
      );
    }

    // Check password
    if (!user.passwordHash) {
      // User likely signed up with OAuth
      throw new AppError(
        401,
        'AUTH_INVALID_CREDENTIALS',
        'Invalid email or password'
      );
    }

    const isPasswordValid = await passwordService.verify(
      user.passwordHash,
      input.password
    );

    if (!isPasswordValid) {
      // Handle failed login attempt
      const newFailCount = user.failedLoginCount + 1;
      let lockUntil: Date | null = null;

      if (newFailCount >= env.LOGIN_MAX_ATTEMPTS) {
        lockUntil = new Date(
          Date.now() + env.LOGIN_LOCKOUT_MIN * 60 * 1000
        );
        await auditService.log({
          userId: user.id,
          eventType: AuditEventType.ACCOUNT_LOCKOUT,
          ip, userAgent
        });
      }

      await User.findByIdAndUpdate(user.id, { failedLoginCount: newFailCount, lockedUntil: lockUntil });

      await auditService.log({
        userId: user.id,
        eventType: AuditEventType.LOGIN_FAIL,
        ip, userAgent
      });

      throw new AppError(
        401,
        'AUTH_INVALID_CREDENTIALS',
        'Invalid email or password'
      );
    }

    // Check email verification
    if (!user.emailVerified) {
      throw new AppError(
        403,
        'AUTH_EMAIL_NOT_VERIFIED',
        'Email not verified. Please check your inbox.'
      );
    }

    // --- Login Successful ---
    
    // Reset fail count and set last login
    await User.findByIdAndUpdate(user.id, {
      failedLoginCount: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    });

    await auditService.log({
      userId: user.id,
      eventType: AuditEventType.LOGIN_SUCCESS,
      ip, userAgent
    });

    return generateAuthResponse(user, ip, userAgent);
  },

  /**
   * 4. Refresh Token (with Rotation & Reuse Detection)
   */
  refresh: async (
    token: string,
    ip?: string,
    userAgent?: string
  ): Promise<AuthTokens> => {
    const oldToken = await tokenService.findRefreshToken(token);

    // Basic checks
    if (!oldToken) {
      throw new AppError(401, 'AUTH_INVALID_REFRESH', 'Invalid refresh token');
    }

    // --- REUSE DETECTION ---
    if (oldToken.revoked || oldToken.replacedById) {
      // CRITICAL: A reused token was detected!
      // This means a token was likely stolen.
      // Revoke all tokens for this user as a security measure.
      await tokenService.revokeAllUserTokens(oldToken.userId);
      
      await auditService.log({
        userId: oldToken.userId,
        eventType: AuditEventType.TOKEN_REUSE_DETECTED,
        ip, userAgent,
        meta: { reusedTokenId: oldToken.id }
      });

      throw new AppError(401, 'AUTH_INVALID_REFRESH', 'Token has been reused');
    }

    // Check expiry
    if (oldToken.expiresAt < new Date()) {
      throw new AppError(401, 'AUTH_INVALID_REFRESH', 'Token has expired');
    }

    // --- ROTATION ---
    // 1. Generate new tokens
    const newTokens = await generateAuthResponse(
      oldToken.userId as Document & { id: string; email: string; emailVerified: boolean; },
      ip,
      userAgent
    );

    // 2. Mark the old token as replaced by the new one
    await tokenService.revokeRefreshToken(oldToken.id); // Revoke the old token
    await tokenService.generateAndStoreRefreshToken(oldToken.userId, ip, userAgent); // Generate new refresh token

    await auditService.log({
      userId: oldToken.userId,
      eventType: AuditEventType.REFRESH,
      ip, userAgent
    });

    return newTokens;
  },

  /**
   * 5. Logout
   */
  logout: async (token: string, ip?: string, userAgent?: string) => {
    const dbToken = await tokenService.findRefreshToken(token);

    if (dbToken && !dbToken.revoked) {
      await tokenService.revokeRefreshToken(dbToken.id);
      await auditService.log({
        userId: dbToken.userId,
        eventType: AuditEventType.LOGOUT,
        ip, userAgent
      });
    }
    // We send 204 regardless of whether the token was found
    // to prevent leaking information.
  },

  /**
   * 6. OAuth Callback (Stub)
   */
  oauthCallback: async (
    provider: string,
    code: string,
    ip?: string,
    userAgent?: string
  ): Promise<AuthTokens> => {
    // --- IMPLEMENTATION NOTE ---
    // This is where you would use passport.js or a library like 'simple-oauth2'.
    // 1. Exchange the `code` for an access token from the provider (e.g., Google).
    // 2. Use the provider's access token to fetch the user's profile (especially their verified email).
    // 3. const userEmail = "verified_email_from_provider@gmail.com";
    // 4. const userName = "Provider Name";
    // 5. const providerId = "provider_specific_user_id";

    // --- Example Pseudo-code ---
    // const { email, name, providerId } = await oauthService.verify(provider, code);
    
    // For this stub, we'll hardcode:
    const email = "oauth.user@example.com";
    const name = "OAuth User";
    const providerId = "123456789";
    // --- End Stub ---


    let user = await User.findOne({ email });

    if (user) {
      // User exists. Link provider if not already linked.
      // You'd add logic here to check and update the `oauthProviders` JSON.
      // e.g., if (!user.oauthProviders.some(p => p.provider === provider)) { ... }
    } else {
      // New user. Create them.
      user = await User.create({
        email,
        name,
        emailVerified: true, // Email is verified by the OAuth provider
        oauthProviders: [{ provider, id: providerId }],
      });
      
      await auditService.log({
        userId: user.id,
        eventType: AuditEventType.SIGNUP,
        meta: { provider }
      });
    }
    
    // Log them in and issue tokens
    await auditService.log({
      userId: user.id,
      eventType: AuditEventType.OAUTH_SUCCESS,
      ip, userAgent,
      meta: { provider }
    });
    
    return generateAuthResponse(user, ip, userAgent);
  },
};