import express from 'express';
import {
  checkIn,
  checkOut,
  getAllSessions,
  getSessionById,
  deleteSession,
  updateCheckIn,
  getUserSessions // Add this import
} from '../controllers/sessionController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Regular user endpoints
router.post('/session/checkin', verifyToken, checkIn);
router.put('/session/checkout/:id', verifyToken, checkOut);
router.put('/session/checkin/:id', verifyToken, updateCheckIn);

// Add this new route for user-specific sessions
router.get('/session/user/:userId', verifyToken, getUserSessions);

// Admin-only endpoints
router.get('/session', verifyToken, isAdmin, getAllSessions);
router.delete('/session/:id', verifyToken, isAdmin, deleteSession);

// Shared endpoint
router.get('/session/:id', verifyToken, getSessionById);

export default router;