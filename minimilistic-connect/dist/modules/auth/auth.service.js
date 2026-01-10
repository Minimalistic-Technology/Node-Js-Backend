"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const config_1 = require("@/config");
const AppError_1 = require("@/core/AppError");
const database_1 = require("@/database");
const audit_service_1 = require("@/services/audit.service");
const password_service_1 = require("@/services/password.service");
const token_service_1 = require("@/services/token.service");
const client_1 = require("@prisma/client");
// Helper to generate full token response
const generateAuthResponse = async (user, ip, userAgent) => {
    const accessToken = token_service_1.tokenService.generateAccessToken(user);
    const { token: refreshToken } = await token_service_1.tokenService.generateAndStoreRefreshToken(user.id, ip, userAgent);
    return {
        accessToken,
        accessExpiresIn: config_1.env.ACCESS_TOKEN_EXP,
        refreshToken,
        refreshExpiresIn: config_1.env.REFRESH_TOKEN_EXP,
    };
};
exports.authService = {
    /**
     * 1. Signup
     */
    signup: async (input) => {
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email: input.email },
        });
        if (existingUser) {
            throw new AppError_1.AppError(409, 'AUTH_EMAIL_IN_USE', 'Email already in use');
        }
        const { hash, algo } = await password_service_1.passwordService.hash(input.password);
        const user = await database_1.prisma.user.create({
            data: {
                email: input.email,
                name: input.name,
                passwordHash: hash,
                passwordAlgo: algo,
                emailVerified: false, // Must verify
            },
        });
        // Send verification email
        const verificationToken = await token_service_1.tokenService.generateEmailVerificationToken(user.id);
        // Use a stub for now
        // await emailService.sendVerificationEmail(user.email, verificationToken);
        console.log(`Verification token for ${user.email}: ${verificationToken}`);
        await audit_service_1.auditService.log({
            userId: user.id,
            eventType: client_1.AuditEventType.SIGNUP,
        });
        return { id: user.id, email: user.email, verified: user.emailVerified };
    },
    /**
     * 2. Verify Email
     */
    verifyEmail: async (token) => {
        const dbToken = await token_service_1.tokenService.findEmailToken(token);
        if (!dbToken ||
            dbToken.consumed ||
            dbToken.expiresAt < new Date()) {
            throw new AppError_1.AppError(400, 'VERIFICATION_INVALID_OR_EXPIRED', 'Verification token is invalid or has expired');
        }
        await database_1.prisma.$transaction([
            database_1.prisma.user.update({
                where: { id: dbToken.userId },
                data: { emailVerified: true },
            }),
            token_service_1.tokenService.consumeEmailToken(dbToken.id),
        ]);
        await audit_service_1.auditService.log({
            userId: dbToken.userId,
            eventType: client_1.AuditEventType.VERIFICATION_SUCCESS,
        });
        return { message: 'Email verified successfully' };
    },
    /**
     * 3. Login
     */
    login: async (input, ip, userAgent) => {
        const user = await database_1.prisma.user.findUnique({ where: { email: input.email } });
        if (!user) {
            throw new AppError_1.AppError(401, 'AUTH_INVALID_CREDENTIALS', 'Invalid email or password');
        }
        // Check account lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new AppError_1.AppError(403, 'AUTH_ACCOUNT_LOCKED', 'Account is locked. Try again later.');
        }
        // Check password
        if (!user.passwordHash) {
            // User likely signed up with OAuth
            throw new AppError_1.AppError(401, 'AUTH_INVALID_CREDENTIALS', 'Invalid email or password');
        }
        const isPasswordValid = await password_service_1.passwordService.verify(user.passwordHash, input.password);
        if (!isPasswordValid) {
            // Handle failed login attempt
            const newFailCount = user.failedLoginCount + 1;
            let lockUntil = null;
            if (newFailCount >= config_1.env.LOGIN_MAX_ATTEMPTS) {
                lockUntil = new Date(Date.now() + config_1.env.LOGIN_LOCKOUT_MIN * 60 * 1000);
                await audit_service_1.auditService.log({
                    userId: user.id,
                    eventType: client_1.AuditEventType.ACCOUNT_LOCKOUT,
                    ip, userAgent
                });
            }
            await database_1.prisma.user.update({
                where: { id: user.id },
                data: { failedLoginCount: newFailCount, lockedUntil: lockUntil },
            });
            await audit_service_1.auditService.log({
                userId: user.id,
                eventType: client_1.AuditEventType.LOGIN_FAIL,
                ip, userAgent
            });
            throw new AppError_1.AppError(401, 'AUTH_INVALID_CREDENTIALS', 'Invalid email or password');
        }
        // Check email verification
        if (!user.emailVerified) {
            throw new AppError_1.AppError(403, 'AUTH_EMAIL_NOT_VERIFIED', 'Email not verified. Please check your inbox.');
        }
        // --- Login Successful ---
        // Reset fail count and set last login
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: {
                failedLoginCount: 0,
                lockedUntil: null,
                lastLoginAt: new Date(),
            },
        });
        await audit_service_1.auditService.log({
            userId: user.id,
            eventType: client_1.AuditEventType.LOGIN_SUCCESS,
            ip, userAgent
        });
        return generateAuthResponse(user, ip, userAgent);
    },
    /**
     * 4. Refresh Token (with Rotation & Reuse Detection)
     */
    refresh: async (token, ip, userAgent) => {
        const oldToken = await token_service_1.tokenService.findRefreshToken(token);
        // Basic checks
        if (!oldToken) {
            throw new AppError_1.AppError(401, 'AUTH_INVALID_REFRESH', 'Invalid refresh token');
        }
        // --- REUSE DETECTION ---
        if (oldToken.revoked || oldToken.replacedById) {
            // CRITICAL: A reused token was detected!
            // This means a token was likely stolen.
            // Revoke all tokens for this user as a security measure.
            await token_service_1.tokenService.revokeAllUserTokens(oldToken.userId);
            await audit_service_1.auditService.log({
                userId: oldToken.userId,
                eventType: client_1.AuditEventType.TOKEN_REUSE_DETECTED,
                ip, userAgent,
                meta: { reusedTokenId: oldToken.id }
            });
            throw new AppError_1.AppError(401, 'AUTH_INVALID_REFRESH', 'Token has been reused');
        }
        // Check expiry
        if (oldToken.expiresAt < new Date()) {
            throw new AppError_1.AppError(401, 'AUTH_INVALID_REFRESH', 'Token has expired');
        }
        // --- ROTATION ---
        // 1. Generate new tokens
        const newTokens = await generateAuthResponse(oldToken.user, ip, userAgent);
        // 2. Mark the old token as replaced by the new one
        await database_1.prisma.refreshToken.update({
            where: { id: oldToken.id },
            data: {
                revoked: true,
                // The `newTokens.dbRecord` is not available from generateAuthResponse.
                // Let's modify generateAuthResponse or (simpler) just find the new token.
                // We know the new token's signature.
                replacedById: (await token_service_1.tokenService.findRefreshToken(newTokens.refreshToken)).id,
            },
        });
        await audit_service_1.auditService.log({
            userId: oldToken.userId,
            eventType: client_1.AuditEventType.REFRESH,
            ip, userAgent
        });
        return newTokens;
    },
    /**
     * 5. Logout
     */
    logout: async (token, ip, userAgent) => {
        const dbToken = await token_service_1.tokenService.findRefreshToken(token);
        if (dbToken && !dbToken.revoked) {
            await token_service_1.tokenService.revokeRefreshToken(dbToken.id);
            await audit_service_1.auditService.log({
                userId: dbToken.userId,
                eventType: client_1.AuditEventType.LOGOUT,
                ip, userAgent
            });
        }
        // We send 204 regardless of whether the token was found
        // to prevent leaking information.
    },
    /**
     * 6. OAuth Callback (Stub)
     */
    oauthCallback: async (provider, code, ip, userAgent) => {
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
        let user = await database_1.prisma.user.findUnique({ where: { email } });
        if (user) {
            // User exists. Link provider if not already linked.
            // You'd add logic here to check and update the `oauthProviders` JSON.
            // e.g., if (!user.oauthProviders.some(p => p.provider === provider)) { ... }
        }
        else {
            // New user. Create them.
            user = await database_1.prisma.user.create({
                data: {
                    email,
                    name,
                    emailVerified: true, // Email is verified by the OAuth provider
                    oauthProviders: [{ provider, id: providerId }],
                },
            });
            await audit_service_1.auditService.log({
                userId: user.id,
                eventType: client_1.AuditEventType.SIGNUP,
                meta: { provider }
            });
        }
        // Log them in and issue tokens
        await audit_service_1.auditService.log({
            userId: user.id,
            eventType: client_1.AuditEventType.OAUTH_SUCCESS,
            ip, userAgent,
            meta: { provider }
        });
        return generateAuthResponse(user, ip, userAgent);
    },
};
