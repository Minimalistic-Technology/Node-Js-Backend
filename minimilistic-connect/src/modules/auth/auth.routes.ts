import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '@/middleware/validate.middleware';
import * as v from './auth.validation';
import { authRateLimiter } from '@/middleware/rateLimit.middleware';

const router = Router();

// Apply rate limiting to all auth routes
router.use(authRateLimiter);

router.post('/signup', validate(v.signupSchema), authController.signup);
router.post('/verify-email', validate(v.verifyEmailSchema), authController.verifyEmail);
router.post('/login', validate(v.loginSchema), authController.login);
router.post('/oauth/callback', validate(v.oauthCallbackSchema), authController.oauthCallback);
router.post('/token/refresh', validate(v.refreshTokenSchema), authController.refresh);
router.post('/logout', validate(v.logoutSchema), authController.logout);

export const authRoutes = router;