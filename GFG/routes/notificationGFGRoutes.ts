import express from 'express';
import {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById,
  markAsReadAndDelete,
  markAllAsReadAndDelete
} from '../controllers/notificationController';

const router = express.Router();

router.post('/create', createNotification);
router.get('/', getAllNotifications);
router.get('/:id', getNotificationById);
router.put('/update/:id', updateNotificationById);
router.delete('/delete/:id', deleteNotificationById);
router.delete('/read/:id', markAsReadAndDelete);          
router.delete('/mark-all-read', markAllAsReadAndDelete); 

export default router;
