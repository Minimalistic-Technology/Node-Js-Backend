import express from "express";
import { verifyToken , isAdmin } from "../middleware/authMiddleware";
import {
  applyLeave,
  editLeave,
  handleLeave,
  getLeaves,
  getLeavesAll,
  getLeaveById,
  deleteLeave,
} from "../controllers/leaveController";

const router = express.Router();

router.post("/apply", verifyToken, applyLeave);           
router.put("/edit/:id", verifyToken, editLeave);
router.get("/myleaves", verifyToken, getLeaves);

router.put("/handle/:id", verifyToken, isAdmin ,  handleLeave);
router.get("/leaves", verifyToken, isAdmin , getLeavesAll);              
router.get("/employee/:id", verifyToken, isAdmin , getLeaveById);   

router.delete("/delete/:id", verifyToken, isAdmin , deleteLeave);   

export default router;
