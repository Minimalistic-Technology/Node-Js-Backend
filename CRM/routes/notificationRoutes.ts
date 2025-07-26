import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController";

const router = express.Router();

router.post("/notifications", createNotification);            
router.get("/notifications/:userId", getUserNotifications);    
router.put("/notifications/read/:id", markAsRead);             
router.delete("/notifications/:id", deleteNotification);       

export default router;
