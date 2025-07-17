import express from 'express';
import {
  createHistory,
  getAllHistories,
  getHistoryByUserId,
  updateHistory,
  deleteHistory
} from '../controllers/historyController';

const router = express.Router();

router.post('/history', createHistory);
router.get('/history', getAllHistories);
router.get('/history/:userId', getHistoryByUserId);
router.put('/history/:userId', updateHistory);
router.delete('/history/:userId', deleteHistory);

export default router;
