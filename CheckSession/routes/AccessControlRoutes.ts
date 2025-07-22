import express from 'express';
import { signup, login, getAllUsers } from '../controllers/authAccessController';
import { verifyToken, isAdmin } from '../Middleware/authMiddleware';

const router = express.Router();

// User authentication endpoints
router.post('/access-control/signup', signup);
router.post('/access-control/login', login);

// Admin-only endpoint to get all users
router.get('/access-control/users', verifyToken, isAdmin, getAllUsers);

export default router;