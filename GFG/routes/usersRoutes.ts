import express from 'express';
import {
  signup,
  login,
  getProfile,
  updateUsername,
  updateProblemSolved,
  deleteUser
} from '../controllers/userController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile/:userId', getProfile);
router.put('/username/:userId', updateUsername);
router.put('/solve/:userId', updateProblemSolved);
router.delete('/:userId', deleteUser);

export default router;
