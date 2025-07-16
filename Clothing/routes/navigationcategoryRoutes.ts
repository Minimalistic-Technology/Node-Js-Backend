import express from 'express';
import CategoryController from '../controllers/navigationcategoryController';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);
router.get('/:gender/:categoryName', CategoryController.getCategoryByNameWithCommonDresses);
router.get('/categories/:gender/:categoryId', CategoryController.getCategoryByNameWithCommonDresses);
router.delete('/categories', CategoryController.deleteAllCategories);
router.delete('/dresses', CategoryController.deleteAllDresses);

router.post('/categories', CategoryController.createCategory);
router.post('/dresses', CategoryController.createDress);

export default router;