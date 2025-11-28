// routes/authRoutes.ts
import { Router } from 'express';
import { register, login, getMe } from '../controllers/authAccessController';
import { isUser } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route (needs valid token in cookie)
router.get('/me', isUser, getMe);

export default router;
