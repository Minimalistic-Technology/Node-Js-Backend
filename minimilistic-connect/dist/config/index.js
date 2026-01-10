"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(5000),
    DATABASE_URL: zod_1.z.string().min(1),
    JWT_ACCESS_SECRET: zod_1.z.string().min(1),
    JWT_REFRESH_SECRET: zod_1.z.string().min(1),
    ACCESS_TOKEN_EXP: zod_1.z.coerce.number().default(900),
    REFRESH_TOKEN_EXP: zod_1.z.coerce.number().default(2592000),
    CLIENT_URL: zod_1.z.string().url(),
    LOGIN_MAX_ATTEMPTS: zod_1.z.coerce.number().default(5),
    LOGIN_LOCKOUT_MIN: zod_1.z.coerce.number().default(15),
    AUTH_RATE_LIMIT_MAX: zod_1.z.coerce.number().default(10),
    AUTH_RATE_LIMIT_WINDOW_MIN: zod_1.z.coerce.number().default(10),
});
// Validate env vars on startup
exports.env = envSchema.parse(process.env);
