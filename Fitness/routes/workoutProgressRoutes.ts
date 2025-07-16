import express from 'express';
import {
  createProgress,
  getProgress,
  updateProgress,
  deleteProgress
} from '../controllers/workoutProgressController';

const router = express.Router();

router.post('/progress', createProgress);
router.get('/progress', getProgress);
router.put('/progress/:id', updateProgress);
router.delete('/progress/:id', deleteProgress);

export default router;