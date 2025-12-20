import crypto from 'crypto';
import bcrypt from 'bcrypt';
import Token from '../models/Token';
import { durationToMs } from '../utils/time';
const SALT_ROUNDS = 10;
export const createTokenString = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
const createExpiryDate = (duration) => new Date(Date.now() + durationToMs(duration));
export const replaceRefreshToken = async (userId, tokenValue, expiresIn) => {
    await Token.deleteMany({ user: userId, type: 'refresh' });
    return storeToken(userId, tokenValue, 'refresh', expiresIn);
};
export const storeResetToken = async (userId, tokenValue, expiresIn) => {
    await Token.deleteMany({ user: userId, type: 'reset' });
    return storeToken(userId, tokenValue, 'reset', expiresIn);
};
export const invalidateTokens = (userId, type) => {
    if (type) {
        return Token.deleteMany({ user: userId, type });
    }
    return Token.deleteMany({ user: userId });
};
const storeToken = async (userId, tokenValue, type, expiresIn) => {
    const tokenHash = await bcrypt.hash(tokenValue, SALT_ROUNDS);
    return Token.create({
        user: userId,
        tokenHash,
        type,
        expiresAt: createExpiryDate(expiresIn)
    });
};
export const verifyStoredToken = async (userId, tokenValue, type) => {
    const tokenDoc = await Token.findOne({ user: userId, type }).sort({ createdAt: -1 });
    if (!tokenDoc) {
        return null;
    }
    const isValid = await bcrypt.compare(tokenValue, tokenDoc.tokenHash);
    if (!isValid) {
        return null;
    }
    if (tokenDoc.expiresAt.getTime() < Date.now()) {
        await tokenDoc.deleteOne();
        return null;
    }
    return tokenDoc;
};
export const deleteToken = (tokenDoc) => tokenDoc.deleteOne();
