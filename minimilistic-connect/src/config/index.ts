import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  ACCESS_TOKEN_EXP: z.coerce.number().default(900),
  REFRESH_TOKEN_EXP: z.coerce.number().default(2592000),
  CLIENT_URL: z.string().url(),
  LOGIN_MAX_ATTEMPTS: z.coerce.number().default(5),
  LOGIN_LOCKOUT_MIN: z.coerce.number().default(15),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().default(10),
  AUTH_RATE_LIMIT_WINDOW_MIN: z.coerce.number().default(10),
});

// Validate env vars on startup
export const env = envSchema.parse(process.env);

