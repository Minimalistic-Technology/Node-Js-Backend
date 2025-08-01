import express from 'express';
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';

const router = express.Router();

router.post('/categories', createCategory);
router.get('/categories', getAllCategories);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
