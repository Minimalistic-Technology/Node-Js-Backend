import express from 'express';
import {
  createProfile,
  getProfile,
  updateProfile
} from '../../controllers/profileController';

const router = express.Router();

router.post('/profile', createProfile);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
