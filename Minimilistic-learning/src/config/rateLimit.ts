import rateLimit from 'express-rate-limit';

const standardHeaders = true;
const legacyHeaders = false;

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders,
  legacyHeaders,
  message: 'Too many login attempts. Please try again later.'
});

export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders,
  legacyHeaders,
  message: 'Too many signup attempts. Please try again later.'
});

export const defaultLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  standardHeaders,
  legacyHeaders
});


