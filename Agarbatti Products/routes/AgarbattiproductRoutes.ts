import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  getRelatedProducts,
  updateProduct,
  deleteProduct
} from '../controllers/productController';

const router = express.Router();

router.post('/', createProduct);              
router.get('/', getAllProducts);           
router.get('/:id', getProductById);          
router.get('/:id/related', getRelatedProducts);
router.put('/:id', updateProduct);          
router.delete('/:id', deleteProduct);         

export default router;
