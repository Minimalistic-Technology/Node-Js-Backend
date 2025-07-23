import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController";

const router = express.Router();

router.post("/", createNotification);            // Create notification
router.get("/:userId", getUserNotifications);    // Get user notifications
router.put("/read/:id", markAsRead);             // Mark notification as read
router.delete("/:id", deleteNotification);       // Delete notification

export default router;
