import express, { Router } from 'express';
import {
  createBlog,
  createQuote,
  deleteBlog,
  deleteQuote,
  getAuditLogs,
  getBlog,
  getDashboardStats,
  listBlogs,
  listQuotes,
  listUsers,
  getProfile,
  updateBlog,
  updateQuote,
  updateUserRole,
  updateUserStatus,
  updateProfile,
} from '../controllers/adminController';
import { authorizeRoles, isAuthenticated, requireSuperAdmin } from '../middleware/auth';

const router: Router = express.Router();

router.use(isAuthenticated);
router.use(authorizeRoles('admin', 'super-admin'));

// user management
router.get('/users', listUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', requireSuperAdmin, updateUserRole);

// blog management
router.post('/blogs', createBlog);
router.get('/blogs', listBlogs);
router.get('/blogs/:id', getBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

// quote management
router.post('/quotes', createQuote);
router.get('/quotes', listQuotes);
router.put('/quotes/:id', updateQuote);
router.delete('/quotes/:id', deleteQuote);

// statistics
router.get('/dashboard/stats', getDashboardStats);

// profile & settings
router.get('/profile/me', getProfile);
router.patch('/profile/me', updateProfile);

// audit logs
router.get('/audit-logs', getAuditLogs);

export default router;

