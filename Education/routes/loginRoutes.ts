import { Router } from 'express';
import { signup, login, refreshToken, logout, getAllUsers, updateUserRole, getUserByToken, authenticateToken } from '../controllers/loginController';

const router: Router = Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);


router.get('/users', getAllUsers); 
router.patch('/users/:id/role', authenticateToken, updateUserRole); 
router.get('/user', authenticateToken, getUserByToken); 

export default router;