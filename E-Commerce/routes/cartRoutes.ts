import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem
} from '../controllers/cartController';

const router = express.Router();

router.post('/cart', addToCart);
router.get('/cart/:userId', getCart);
router.put('/cart/:id', updateCartItem);
router.delete('/cart/:id', deleteCartItem);

export default router;
