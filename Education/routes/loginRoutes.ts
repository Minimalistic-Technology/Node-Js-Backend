import { Router } from 'express';
import { signup, login, refreshToken, logout, getAllUsers, updateUserRole, getUserByToken, authenticateToken } from '../controllers/loginController';

const router: Router = Router();

// Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected routes (require authentication)
router.get('/users', getAllUsers); // Get all users (without passwords)
router.patch('/users/:id/role', authenticateToken, updateUserRole); // Update user role
router.get('/user', authenticateToken, getUserByToken); // Get user by token

export default router;