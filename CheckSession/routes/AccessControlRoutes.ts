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


router.post('/access-control/signup', signup);
router.post('/access-control/login', login);


router.get('/access-control/users', getAllUsers);


router.put('/access-control/user/:id', updateUser);
router.delete('/access-control/user/:id', deleteUser);
router.get('/access-control/me', getLoggedInUser);

export default router;
