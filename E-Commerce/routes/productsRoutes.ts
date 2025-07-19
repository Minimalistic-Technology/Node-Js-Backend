import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';

const router = Router();

router.post('/product', createProduct);
router.get('/product', getAllProducts);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);

export default router;
