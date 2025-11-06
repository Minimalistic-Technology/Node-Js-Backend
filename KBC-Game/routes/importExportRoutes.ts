import express from "express";
import { importQuestions, exportQuestions, getImportJobStatus } from "../controllers/importExportController";
import { requireAdminAuth } from "../middlewares/authMiddleware";
import { uploadSingle } from "../middlewares/uploadStream";

const router = express.Router();

router.post("/import/questions", requireAdminAuth, uploadSingle("file"), importQuestions);
router.get("/export/questions", requireAdminAuth, exportQuestions);
router.get("/import/jobs/:id", requireAdminAuth, getImportJobStatus);

export default router;
