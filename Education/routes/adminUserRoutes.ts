import express from "express";
import {
  createAdminUser,
  getAllAdminUsers,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
} from "../controllers/adminUserController";

const router = express.Router();

router.post("/adminuser", createAdminUser);
router.get("/adminuser", getAllAdminUsers);
router.get("/adminuser/:id", getAdminUserById);
router.put("/adminuser/:id", updateAdminUser);
router.delete("/adminuser/:id", deleteAdminUser);

export default router;
