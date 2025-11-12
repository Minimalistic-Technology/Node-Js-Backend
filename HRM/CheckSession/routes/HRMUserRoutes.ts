import express from "express";
import {
  getMyProfile,
  getUserProfile,
  updateMyProfile,
  adminUpdateProfile,
  getUserAudit,
  uploadAvatar,
} from "../controllers/userController";
import { verifyFirebaseToken } from "../middleware/firebaseAuth";
import { requireAdmin } from "../middleware/roleCheck";
import { upload } from "../utils/upload";

const router = express.Router();

router.use(verifyFirebaseToken);

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);
router.post("/me/avatar", upload.single("avatar"), uploadAvatar);
router.get("/:id", getUserProfile);
router.put("/:id", requireAdmin, adminUpdateProfile);
router.get("/:id/audit", requireAdmin, getUserAudit);

export default router;
