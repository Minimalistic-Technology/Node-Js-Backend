import express from "express";
import {
  activateUser,
  deleteUser,
  enrollSpecificTag,
  forgotPassword,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  resetPassword,
  socialAuth,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/registration", registrationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout",isAuthenticated, logoutUser);

userRouter.get("/me", isAuthenticated, getUserInfo);

userRouter.post("/social-auth", socialAuth);

userRouter.put("/update-user-info",isAuthenticated, updateUserInfo);

userRouter.put("/update-user-password", isAuthenticated, updatePassword);

userRouter.put("/update-user-avatar", isAuthenticated, updateProfilePicture);
userRouter.post("/enroll", isAuthenticated, enrollSpecificTag);

userRouter.post("/auth/forgot-password", forgotPassword);
userRouter.post("/auth/reset-password/:token", resetPassword);


userRouter.get(
  "/get-users",
  isAuthenticated,
  authorizeRoles("admin", "viewer"),
  getAllUsers
);

userRouter.put(
  "/update-user",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);

userRouter.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

export default userRouter;
