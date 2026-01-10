"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthCallbackSchema = exports.logoutSchema = exports.refreshTokenSchema = exports.verifyEmailSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8, 'Password must be at least 8 characters long'),
        name: zod_1.z.string().optional(),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    }),
});
exports.verifyEmailSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(1),
    }),
});
exports.refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1),
    }),
});
exports.logoutSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1),
    }),
});
exports.oauthCallbackSchema = zod_1.z.object({
    body: zod_1.z.object({
        provider: zod_1.z.enum(['google', 'github', 'linkedin']),
        code: zod_1.z.string().min(1),
    }),
});
