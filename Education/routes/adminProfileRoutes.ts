import express from "express";
import {
  createAdminProfile,
  getAllAdminProfiles,
  getAdminProfileById,
  updateAdminProfile,
  deleteAdminProfile,
} from "../controllers/adminProfileController";

const router = express.Router();

router.post("/admins", createAdminProfile);
router.get("/admins", getAllAdminProfiles);
router.get("/admins/:id", getAdminProfileById);
router.put("/admins/:id", updateAdminProfile);
router.delete("/admins/:id", deleteAdminProfile);

export default router;
