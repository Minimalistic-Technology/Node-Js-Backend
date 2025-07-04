import { Request, Response } from "express";
import { NotificationModel } from "../models/notification";

// Create Notification
export const createNotification = async (req: Request, res: Response) => {
  try {
    const notification = await NotificationModel.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: "Failed to create notification" });
  }
};

// Get All Notifications (by user)
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Mark as Read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await NotificationModel.findByIdAndUpdate(
      id,
      { read: true, readAt: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to mark as read" });
  }
};

// Delete Notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    await NotificationModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};
