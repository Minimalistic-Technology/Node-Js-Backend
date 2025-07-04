import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { PaymentMethod, Order } from '../models/payment';

let paymentMethods: PaymentMethod[] = [];
let orders: Order[] = [];

export const createPaymentMethod = (req: Request, res: Response) => {
  const { type, cardNumber, expiryDate, cvv, cardholderName } = req.body;
  const processingFee = type === 'BankTransfer' ? 2.99 : type === 'CashOnDelivery' ? 5.99 : 0;
  const newPaymentMethod: PaymentMethod = {
    id: uuidv4(),
    type,
    cardNumber,
    expiryDate,
    cvv,
    cardholderName,
    processingFee,
  };
  paymentMethods.push(newPaymentMethod);
  res.status(201).json(newPaymentMethod);
};

export const getPaymentMethods = (req: Request, res: Response) => {
  res.json(paymentMethods);
};

export const updatePaymentMethod = (req: Request, res: Response) => {
  const { id } = req.params;
  const { type, cardNumber, expiryDate, cvv, cardholderName } = req.body;
  const paymentMethod = paymentMethods.find(pm => pm.id === id);
  if (paymentMethod) {
    paymentMethod.type = type || paymentMethod.type;
    paymentMethod.cardNumber = cardNumber || paymentMethod.cardNumber;
    paymentMethod.expiryDate = expiryDate || paymentMethod.expiryDate;
    paymentMethod.cvv = cvv || paymentMethod.cvv;
    paymentMethod.cardholderName = cardholderName || paymentMethod.cardholderName;
    paymentMethod.processingFee = type === 'BankTransfer' ? 2.99 : type === 'CashOnDelivery' ? 5.99 : 0;
    res.json(paymentMethod);
  } else {
    res.status(404).json({ message: 'Payment method not found' });
  }
};

export const deletePaymentMethod = (req: Request, res: Response) => {
  const { id } = req.params;
  const index = paymentMethods.findIndex(pm => pm.id === id);
  if (index !== -1) {
    paymentMethods.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Payment method not found' });
  }
};

export const createOrder = (req: Request, res: Response) => {
  const { paymentMethodId, items, subtotal, shipping, tax } = req.body;
  const total = subtotal + shipping + tax;
  const newOrder: Order = {
    id: uuidv4(),
    items,
    subtotal,
    shipping,
    tax,
    total,
    paymentMethodId,
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
};

export const getOrders = (req: Request, res: Response) => {
  res.json(orders);
};