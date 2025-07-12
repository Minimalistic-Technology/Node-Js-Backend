import express from "express";
import {
  createStudyMaterial,
  getAllStudyMaterials,
  getStudyMaterialById,
  updateStudyMaterial,
  deleteStudyMaterial,
} from "../controllers/studyMaterialController";

const router = express.Router();

router.post("/study-materials", createStudyMaterial);
router.get("/study-materials", getAllStudyMaterials);
router.get("/study-materials/:id", getStudyMaterialById);
router.put("/study-materials/:id", updateStudyMaterial);
router.delete("/study-materials/:id", deleteStudyMaterial);

export default router;
