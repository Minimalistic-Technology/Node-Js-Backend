import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import { env } from '@/config';
import User from '@/models/User.model';
import RefreshToken from '@/models/RefreshToken.model';
import EmailVerificationToken from '@/models/EmailVerificationToken.model';
import { Document, Types } from 'mongoose';
import { TokenPayload } from '@/modules/auth/auth.types';

const hashToken = (token: string) => {
  return createHash('sha256').update(token).digest('hex');
};

export const tokenService = {
  /**
   * Generates a short-lived Access Token (JWT).
   */
  generateAccessToken: (user: Document & { id: string; email: string; name: string | null; }): string => {
    const payload: TokenPayload = {
      sub: user.id.toString(), // Convert ObjectId to string
      email: user.email,
      name: user.name,
    };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.ACCESS_TOKEN_EXP,
      jwtid: randomBytes(16).toString('hex'), // jti
    });
  },

  /**
   * Creates an opaque refresh token, hashes it, and stores it in the DB.
   */
  generateAndStoreRefreshToken: async (
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ token: string; dbRecord: Document & { userId: Types.ObjectId, tokenSignature: string, expiresAt: Date, ipAddress?: string, userAgent?: string } }> => {
    const token = randomBytes(64).toString('hex');
    const tokenSignature = hashToken(token);
    const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXP * 1000);

    const dbRecord = await RefreshToken.create({
      userId: new Types.ObjectId(userId),
      tokenSignature,
      expiresAt,
      ipAddress,
      userAgent,
    });

    return { token, dbRecord };
  },

  /**
   * Generates tokens for email verification.
   */
  generateEmailVerificationToken: async (
    userId: string
  ): Promise<string> => {
    const token = randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour expiry

    await EmailVerificationToken.create({
      userId: new Types.ObjectId(userId),
      tokenHash,
      expiresAt,
    });
    return token;
  },

  /**
   * Verifies a JWT.
   */
  verifyAccessToken: (token: string): TokenPayload | null => {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  },

  /**
   * Finds a refresh token in the DB by its (hashed) signature.
   */
  findRefreshToken: async (token: string) => {
    const tokenSignature = hashToken(token);
    return RefreshToken.findOne({ tokenSignature }).populate('userId');
  },

  /**
   * Finds an email verification token in the DB.
   */
  findEmailToken: async (token: string) => {
    const tokenHash = hashToken(token);
    return EmailVerificationToken.findOne({ tokenHash });
  },

  /**
   * Revokes a refresh token by its ID.
   */
  revokeRefreshToken: async (id: string) => {
    return RefreshToken.findByIdAndUpdate(id, { revoked: true });
  },

  /**
   * Revokes all tokens for a user. Used for security events.
   */
  revokeAllUserTokens: async (userId: string) => {
    return RefreshToken.updateMany({ userId, revoked: false }, { revoked: true });
  },

  /**
   * Marks an email token as consumed.
   */
  consumeEmailToken: async (id: string) => {
    return EmailVerificationToken.findByIdAndUpdate(id, { consumed: true });
  },
};
