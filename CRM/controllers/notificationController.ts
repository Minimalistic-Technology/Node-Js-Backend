import { Request, Response } from "express";
import { NotificationModel } from "../models/notification";

// Create a new notification
export const createNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const notification = await NotificationModel.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    console.error("Create Notification Error:", err);
    res.status(400).json({ error: "Failed to create notification" });
  }
};

// Get all notifications for a user
export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Fetch Notifications Error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Mark a notification as read
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await NotificationModel.findByIdAndUpdate(
      id,
      { read: true, readAt: new Date() },
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error("Mark As Read Error:", err);
    res.status(400).json({ error: "Failed to mark notification as read" });
  }
};

// Delete a notification
export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await NotificationModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Delete Notification Error:", err);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};
