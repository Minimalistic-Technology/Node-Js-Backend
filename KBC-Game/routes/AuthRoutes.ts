import express from "express";
import { loginUser, getUserProfile } from "../controllers/authController";

const router = express.Router();

router.post("/login", loginUser);
router.get("/me", getUserProfile);

export default router;
