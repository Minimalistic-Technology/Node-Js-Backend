import express from 'express';
import {
  getHistoryByUserId,
  getAllUserHistoryByUserId,
  checkIn,
  checkOut,
} from '../controllers/historyController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/userHistoryByUserId/:userId',verifyToken,getAllUserHistoryByUserId);
router.post('/checkin', verifyToken, checkIn);
router.put('/checkout', verifyToken, checkOut);
router.get('/HistoryByUserId',verifyToken,getHistoryByUserId);

export default router;
