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

// Admin only
router.get('/history', verifyToken, isAdmin, getAllHistories);
router.delete('/history/:userId', verifyToken, isAdmin, deleteHistory);

// User access
router.get('/history/:userId', verifyToken, getHistoryByUserId);
router.put('/history/:userId', verifyToken, updateHistory);

export default router;
