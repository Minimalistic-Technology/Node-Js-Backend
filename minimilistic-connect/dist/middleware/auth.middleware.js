"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const AppError_1 = require("@/core/AppError");
const token_service_1 = require("@/services/token.service");
const database_1 = require("@/database");
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError_1.AppError(401, 'AUTH_UNAUTHORIZED', 'No token provided');
        }
        const token = authHeader.split(' ')[1];
        const payload = token_service_1.tokenService.verifyAccessToken(token);
        if (!payload) {
            throw new AppError_1.AppError(401, 'AUTH_UNAUTHORIZED', 'Invalid or expired token');
        }
        const user = await database_1.prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user) {
            throw new AppError_1.AppError(401, 'AUTH_UNAUTHORIZED', 'User not found');
        }
        // Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.protect = protect;
