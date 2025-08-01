import { Request, Response } from 'express';
import Notification from '../models/notificationModel';

export const createNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create notification', details: err });
  }
};

export const getAllNotifications = async (_req: Request, res: Response): Promise<void> => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.status(200).json(notifications);
};

export const getNotificationById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const notification = await Notification.findById(id);
  if (!notification) {
    res.status(404).json({ error: 'Notification not found' });
    return;
  }
  res.status(200).json(notification);
};

export const updateNotificationById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updated = await Notification.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) {
    res.status(404).json({ error: 'Notification not found' });
    return;
  }
  res.status(200).json(updated);
};

export const deleteNotificationById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await Notification.findByIdAndDelete(id);
  res.status(200).json({ message: 'Notification deleted' });
};
