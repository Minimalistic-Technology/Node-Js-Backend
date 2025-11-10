"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = require("crypto");
const config_1 = require("@/config");
const database_1 = require("@/database");
const hashToken = (token) => {
    return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
};
exports.tokenService = {
    /**
     * Generates a short-lived Access Token (JWT).
     */
    generateAccessToken: (user) => {
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
        };
        return jsonwebtoken_1.default.sign(payload, config_1.env.JWT_ACCESS_SECRET, {
            expiresIn: config_1.env.ACCESS_TOKEN_EXP,
            jwtid: (0, crypto_1.randomBytes)(16).toString('hex'), // jti
        });
    },
    /**
     * Creates an opaque refresh token, hashes it, and stores it in the DB.
     */
    generateAndStoreRefreshToken: async (userId, ipAddress, userAgent) => {
        const token = (0, crypto_1.randomBytes)(64).toString('hex');
        const tokenSignature = hashToken(token);
        const expiresAt = new Date(Date.now() + config_1.env.REFRESH_TOKEN_EXP * 1000);
        const dbRecord = await database_1.prisma.refreshToken.create({
            data: {
                userId,
                tokenSignature,
                expiresAt,
                ipAddress,
                userAgent,
            },
        });
        return { token, dbRecord };
    },
    /**
     * Generates tokens for email verification.
     */
    generateEmailVerificationToken: async (userId) => {
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const tokenHash = hashToken(token);
        const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour expiry
        await database_1.prisma.emailVerificationToken.create({
            data: {
                userId,
                tokenHash,
                expiresAt,
            },
        });
        return token;
    },
    /**
     * Verifies a JWT.
     */
    verifyAccessToken: (token) => {
        try {
            return jsonwebtoken_1.default.verify(token, config_1.env.JWT_ACCESS_SECRET);
        }
        catch (error) {
            return null;
        }
    },
    /**
     * Finds a refresh token in the DB by its (hashed) signature.
     */
    findRefreshToken: async (token) => {
        const tokenSignature = hashToken(token);
        return database_1.prisma.refreshToken.findUnique({
            where: { tokenSignature },
            include: { user: true },
        });
    },
    /**
     * Finds an email verification token in the DB.
     */
    findEmailToken: async (token) => {
        const tokenHash = hashToken(token);
        return database_1.prisma.emailVerificationToken.findUnique({
            where: { tokenHash },
        });
    },
    /**
     * Revokes a refresh token by its ID.
     */
    revokeRefreshToken: async (id) => {
        return database_1.prisma.refreshToken.update({
            where: { id },
            data: { revoked: true },
        });
    },
    /**
     * Revokes all tokens for a user. Used for security events.
     */
    revokeAllUserTokens: async (userId) => {
        return database_1.prisma.refreshToken.updateMany({
            where: { userId, revoked: false },
            data: { revoked: true },
        });
    },
    /**
     * Marks an email token as consumed.
     */
    consumeEmailToken: async (id) => {
        return database_1.prisma.emailVerificationToken.update({
            where: { id },
            data: { consumed: true },
        });
    },
};
