import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getUserBlogs,
  getRelatedBlogs,
  updateBlog,
  deleteBlog,
  deleteAllBlogs,
  getMostViewedBlogs,
  getMostRecentBlogs,
} from '../controllers/blogController';
import authenticateToken from '../middleware/authMiddleware';

const router = express.Router();

// Route order matters — place more specific routes first
router.get('/related', getRelatedBlogs);
router.get('/my-blogs', authenticateToken, getUserBlogs);
router.post('/', authenticateToken, createBlog);
router.get('/', getAllBlogs);
router.get('/most-viewed', getMostViewedBlogs);
router.get('/most-recent', getMostRecentBlogs);
router.get('/:id', getBlogById);
router.put('/:id', authenticateToken, updateBlog);
router.delete('/', deleteAllBlogs);
router.delete('/:id', authenticateToken, deleteBlog);

export default router;
