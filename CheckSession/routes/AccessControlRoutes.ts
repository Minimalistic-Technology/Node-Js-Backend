import express from 'express';
import {
  signup,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
  getLoggedInUser
} from '../controllers/authAccessController';

const router = express.Router();

// Authentication
router.post('/access-control/signup', signup);
router.post('/access-control/login', login);

// Public admin panel access (no token checks anymore)
router.get('/access-control/users', getAllUsers);

// New APIs for Admin Panel
router.put('/access-control/user/:id', updateUser);
router.delete('/access-control/user/:id', deleteUser);
router.get('/access-control/me', getLoggedInUser);

export default router;
