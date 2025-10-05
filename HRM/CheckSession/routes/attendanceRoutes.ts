import express from 'express';
import {
} from '../controllers/attendanceController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

import {
  checkIn,
  checkOut,
  getAttendanceByDate,
  getAttendanceByEmployee,
} from "../controllers/attendanceController";


router.post("/checkin", verifyToken , checkIn);
router.post("/checkout", verifyToken,  checkOut);
router.get("/date/:date",verifyToken ,  getAttendanceByDate);
router.get("/employee/:eid", verifyToken , getAttendanceByEmployee);

export default router;