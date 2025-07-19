import express from "express";
import { signup, login } from "../controllers/authAccessController";

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);

export default router;
