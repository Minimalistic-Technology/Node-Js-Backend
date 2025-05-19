import express, { Router } from 'express';
import * as blogController from '../controllers/blogController';

const router: Router = express.Router();

router.post('/', blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

export default router;
