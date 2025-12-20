import { Router } from 'express';
import {
  createProductPrice,
  getAllProductPrices,
  updateProductPrice,
  deleteProductPrice,
} from '../controllers/productPriceController';

const router = Router();

router.post('/product-price', createProductPrice);
router.get('/product-price', getAllProductPrices);
router.put('/product-price/:id', updateProductPrice);
router.delete('/product-price/:id', deleteProductPrice);

export default router;
