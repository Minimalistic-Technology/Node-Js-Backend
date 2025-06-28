import express from 'express';
import { createPaymentMethod, getPaymentMethods, updatePaymentMethod, deletePaymentMethod, createOrder, getOrders } from '../controllers/paymentController';

const router = express.Router();

router.post('/payment-methods', createPaymentMethod);
router.get('/payment-methods', getPaymentMethods);
router.put('/payment-methods/:id', updatePaymentMethod);
router.delete('/payment-methods/:id', deletePaymentMethod);

router.post('/orders', createOrder);
router.get('/orders', getOrders);

export default router;