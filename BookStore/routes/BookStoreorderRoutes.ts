// File: orderroutes.ts
import express from 'express';
import { createOrder, getAllOrders, updateOrderStatus, deleteOrder } from '../controllers/ordercontroller';

const router = express.Router();

router.post('/orders', createOrder);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

export default router;