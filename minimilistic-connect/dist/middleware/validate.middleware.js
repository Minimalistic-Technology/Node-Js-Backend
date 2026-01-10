"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const AppError_1 = require("@/core/AppError");
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            next(new AppError_1.AppError(400, 'VALIDATION_ERROR', 'Invalid request data', error.errors));
        }
        else {
            next(new AppError_1.AppError(500, 'INTERNAL_ERROR', 'Internal server error'));
        }
    }
};
exports.validate = validate;
