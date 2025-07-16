import express from 'express';
import {
  createOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from '../controllers/ordercontroller';

const router = express.Router();

router.post('/orders', createOrder);         // Create new order
router.get('/orders', getAllOrders);         // Get all orders
router.put('/orders/:id', updateOrder);      // Update order status
router.delete('/orders/:id', deleteOrder);   // Delete order

export default router;
