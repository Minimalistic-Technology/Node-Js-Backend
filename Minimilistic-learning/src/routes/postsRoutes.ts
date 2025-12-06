import { Router } from 'express';
import { getPosts, getPostBySlug, getPostComments, postComment } from '../controllers/postsController';
import requireAuth from '../middleware/requireAuth';
import { commentRateLimit } from '../middleware/commentRateLimit';

const router = Router();

router.get('/', getPosts);
// More specific route must come before generic :slug route
router.get('/:postId/comments', getPostComments);
router.post('/:postId/comments', requireAuth, commentRateLimit, postComment);
router.get('/:slug', getPostBySlug);

export default router;

