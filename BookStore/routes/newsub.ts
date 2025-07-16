import express, { Router } from 'express';
import {
  sendEmailHandler,
  getSubscribersHandler,
} from '../../BookStore/controllers/newsub';

const router: Router = express.Router();

router.post('/send', sendEmailHandler);
router.get('/subscribers', getSubscribersHandler);

export default router;
