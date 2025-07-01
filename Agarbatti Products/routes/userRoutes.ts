import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

router.post("/registered-users", createUser);
router.get("/registered-users", getAllUsers);
router.get("/registered-users/:id", getUserById);
router.put("/registered-users/:id", updateUser);
router.delete("/registered-users/:id", deleteUser);

export default router;
