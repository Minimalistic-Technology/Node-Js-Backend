import express from 'express';
import {
  createHistory,
  getAllHistories,
  getHistoryByUserId,
  updateHistory,
  deleteHistory
} from '../controllers/historyController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/history', verifyToken, createHistory);
router.get('/history', verifyToken, getAllHistories);
router.delete('/history/:userId', verifyToken, isAdmin, deleteHistory);

router.get('/history/:userId', verifyToken, getHistoryByUserId);
router.put('/history/:userId', verifyToken, updateHistory);

export default router;
