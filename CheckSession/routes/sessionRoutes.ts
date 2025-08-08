import express from 'express';
import {
  checkIn,
  checkOut,
  getAllSessions,
  getSessionById,
  deleteSession,
  updateCheckIn,
  getUserSessions,
  getFullUserDetails
} from '../controllers/sessionController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/session/checkin', verifyToken, checkIn);
router.put('/session/checkout/:id', verifyToken, checkOut);
router.put('/session/checkin/:id', verifyToken, updateCheckIn);
router.get('/session/user/:userId', verifyToken, getUserSessions);

router.get('/session/user/details/:userId', verifyToken, isAdmin, getFullUserDetails);

router.get('/session', verifyToken, isAdmin, getAllSessions);
router.get('/session/:id', verifyToken, getSessionById);
router.delete('/session/:id', verifyToken, isAdmin, deleteSession);

export default router;
