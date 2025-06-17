import express from 'express';
import {
  postFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback
} from '../controllers/feedback.controller';

const router = express.Router();

router.post('/feedback', postFeedback);
router.get('/feedback', getFeedback);
router.put('/feedback/:id', updateFeedback);
router.delete('/feedback/:id', deleteFeedback);

export default router;
