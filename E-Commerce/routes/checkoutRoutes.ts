import express from 'express';
import {
  createCheckout,
  getCheckouts,
  updateCheckout,
  deleteCheckout
} from '../controllers/checkoutController';

const router = express.Router();

router.post('/checkout', createCheckout);
router.get('/checkout', getCheckouts);
router.put('/checkout/:id', updateCheckout);
router.delete('/checkout/:id', deleteCheckout);

export default router;
