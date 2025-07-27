import { Request, Response } from 'express';
import CancelledOrder from '../models/CancelledOrder'; 

export const getCancelReasons = (_req: Request, res: Response) => {
  const reasons: string[] = [
    "I changed my mind",
    "I don't like the book content",
    "Found the book cheaper elsewhere",
    "The book is taking too long to arrive",
    "I ordered the wrong book",
    "I wanted a different edition or format",
    "I no longer need the book",
    "Other"
  ];

  res.status(200).json({ reasons });
};

export const submitCancelRequest = async (req: Request, res: Response): Promise<void> => {
  const { orderId, userId, reason } = req.body;

  if (!orderId || !userId || !reason) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    const order = await CancelledOrder.findOne({ _id: orderId, user: userId });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (order.status === 'cancelled') {
      res.status(400).json({ message: 'Order is already cancelled' });
      return;
    }

    order.status = 'cancelled';
    order.cancelReason = reason;
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
  }
};
