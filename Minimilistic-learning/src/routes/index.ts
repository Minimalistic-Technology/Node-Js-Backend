import { Router } from 'express';
import authRoutes from './authRoutes';
import postsRoutes from './postsRoutes';
import commentsRoutes from './commentsRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postsRoutes);
router.use('/comments', commentsRoutes);

export default router;

