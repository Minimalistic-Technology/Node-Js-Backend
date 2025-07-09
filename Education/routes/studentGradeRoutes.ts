import express from "express";
import {
  createGrade,
  getAllGrades,
  getGradeById,
  updateGrade,
  deleteGrade
} from "../controllers/studentGradeController";

const router = express.Router();

router.post("/grades", createGrade);
router.get("/grades", getAllGrades);
router.get("/grades/:id", getGradeById);
router.put("/grades/:id", updateGrade);
router.delete("/grades/:id", deleteGrade);

export default router;
