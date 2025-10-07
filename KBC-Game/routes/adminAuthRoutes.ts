import { Router } from "express";
import {
  register,
  verify,
  login,
  forgotPassword,
  resetPassword,
  me,
  logout,
} from "../controllers/adminAuthController";


import { requireAdminAuth } from "../middlewares/authmiddleware";
import { limiter } from "../middlewares/rateLimiter";

const router = Router();

router.post("/admins/register", limiter, register);
router.get("/admins/verify", verify);
router.post("/admins/login", limiter, login);
router.post("/admins/password/forgot", limiter, forgotPassword);
router.post("/admins/password/reset", resetPassword);
router.get("/admins/me", requireAdminAuth, me);
router.post("/admins/logout", requireAdminAuth, logout);

export default router;
