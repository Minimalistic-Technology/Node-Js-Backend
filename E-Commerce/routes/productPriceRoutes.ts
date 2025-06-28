import { Router } from 'express';
import {
  createProductPrice,
  getAllProductPrices,
  updateProductPrice,
  deleteProductPrice,
} from '../controllers/productPriceController';

const router = Router();

router.post('/', createProductPrice);
router.get('/', getAllProductPrices);
router.put('/:id', updateProductPrice);
router.delete('/:id', deleteProductPrice);

export default router;
