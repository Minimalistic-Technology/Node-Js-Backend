import express from 'express';
import {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById
} from '../controllers/notificationController';

const router = express.Router();

router.post('/create', createNotification);
router.get('/', getAllNotifications);
router.get('/:id', getNotificationById);
router.put('/update/:id', updateNotificationById);
router.delete('/delete/:id', deleteNotificationById);

export default router;
