import express from 'express';
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  bulkUpdateCod
} from '../controllers/categoryController';

const router = express.Router();

router.put("/categories/bulk-cod", bulkUpdateCod);
router.post('/categories', createCategory);
router.get('/categories', getAllCategories);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);


export default router;