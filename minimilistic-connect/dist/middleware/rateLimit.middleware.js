"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const AppError_1 = require("@/core/AppError");
const config_1 = require("@/config");
const logger_1 = require("@/core/logger");
exports.authRateLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: config_1.env.AUTH_RATE_LIMIT_WINDOW_MIN * 60 * 1000, // minutes
    max: config_1.env.AUTH_RATE_LIMIT_MAX, // Limit each IP to X requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next, options) => {
        logger_1.logger.warn(`Too many requests from IP: ${req.ip}. Rate limit for route: ${req.originalUrl}`);
        next(new AppError_1.AppError(options.statusCode, 'TOO_MANY_REQUESTS', options.message));
    },
});
