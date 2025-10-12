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
  getAbsentEmployee,
  getAttendanceByEmployeeSelf,
} from "../controllers/attendanceController";


router.post("/checkin", verifyToken , checkIn);
router.post("/checkout", verifyToken,  checkOut);
router.get("/absent/:date" , getAbsentEmployee);
router.get("/date/:date",verifyToken ,  getAttendanceByDate);
router.get("/employee/:eid", verifyToken , getAttendanceByEmployee);
router.get("/emp/attendance", verifyToken , getAttendanceByEmployeeSelf);
export default router;