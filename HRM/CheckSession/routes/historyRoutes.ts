import express from 'express';
import {
  getHistoryByUserId,
  getAllUserHistoryByUserId,
  checkIn,
  checkOut,
} from '../controllers/historyController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/userHistoryByUserId:userId',verifyToken,getAllUserHistoryByUserId);
router.post('/session/checkin', verifyToken, checkIn);
router.put('/session/checkout/:userId', verifyToken, checkOut);
router.get('/HistoryByUserId:userId',verifyToken,getHistoryByUserId);

export default router;
