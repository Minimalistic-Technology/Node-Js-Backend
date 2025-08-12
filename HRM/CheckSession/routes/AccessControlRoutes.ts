import express from 'express';
import {
  signup,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
  getLoggedInUser,
  getUserById
} from '../controllers/authAccessController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/access-control/signup', signup);
router.post('/access-control/login', login);

router.get('/access-control/users', verifyToken, isAdmin, getAllUsers);
router.get('/access-control/user/:id', verifyToken, isAdmin, getUserById);

router.put('/access-control/user/:id', verifyToken, isAdmin, updateUser);
router.delete('/access-control/user/:id', verifyToken, isAdmin, deleteUser);

router.get('/access-control/me', verifyToken, getLoggedInUser);

export default router;
