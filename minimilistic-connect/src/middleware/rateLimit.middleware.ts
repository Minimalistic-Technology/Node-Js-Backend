import { rateLimit } from 'express-rate-limit';
import { AppError } from '@/core/AppError';
import { env } from '@/config';
import { logger } from '@/core/logger';

export const authRateLimiter = rateLimit({
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MIN * 60 * 1000, // minutes
  max: env.AUTH_RATE_LIMIT_MAX, // Limit each IP to X requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    logger.warn(
      `Too many requests from IP: ${req.ip}. Rate limit for route: ${req.originalUrl}`
    );
    next(new AppError(options.statusCode, 'TOO_MANY_REQUESTS', options.message));
  },
});

