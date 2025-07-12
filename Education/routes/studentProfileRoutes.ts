import express from "express";
import {
  createStudentProfile,
  getAllStudentProfiles,
  getStudentProfileById,
  updateStudentProfile,
  deleteStudentProfile,
} from "../controllers/studentProfileController";

const router = express.Router();

router.post("/students", createStudentProfile);
router.get("/students", getAllStudentProfiles);
router.get("/students/:id", getStudentProfileById);
router.put("/students/:id", updateStudentProfile);
router.delete("/students/:id", deleteStudentProfile);

export default router;
