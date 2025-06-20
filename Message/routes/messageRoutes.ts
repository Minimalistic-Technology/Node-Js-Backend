import express, { Router } from 'express';
import { sendMessage } from '../controllers/messageController';

const router: Router = express.Router();

router.post('/send-message', sendMessage);

export default router;