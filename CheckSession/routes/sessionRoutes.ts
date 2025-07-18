import express from 'express';
import {
  checkIn,
  checkOut,
  getAllSessions,
  getSessionById,
  deleteSession,
  updateCheckIn
} from '../controllers/sessionController';

const router = express.Router();

router.post('/session/checkin', checkIn);
router.put('/session/checkout/:id', checkOut);
router.put('/session/checkin/:id', updateCheckIn);
router.get('/session', getAllSessions);
router.get('/session/:id', getSessionById);
router.delete('/session/:id', deleteSession);

export default router;
