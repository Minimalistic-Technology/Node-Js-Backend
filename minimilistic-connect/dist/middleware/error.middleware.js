"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const AppError_1 = require("@/core/AppError");
const config_1 = require("@/config");
const logger_1 = require("@/core/logger"); // Assuming you set up pino/winston
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof AppError_1.AppError) {
        logger_1.logger.warn({
            code: err.errorCode,
            message: err.message,
            details: err.details,
        });
        return res.status(err.statusCode).json({
            error: err.errorCode,
            message: err.message,
            details: err.details,
        });
    }
    // Handle unexpected errors
    logger_1.logger.error(err, 'An unexpected error occurred');
    return res.status(500).json({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.',
        details: config_1.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.errorMiddleware = errorMiddleware;
