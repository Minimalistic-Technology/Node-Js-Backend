import { Router } from 'express';
import { deleteComment } from '../controllers/commentsController';
import requireAuth from '../middleware/requireAuth';

const router = Router();

router.delete('/:id', requireAuth, deleteComment);

export default router;

