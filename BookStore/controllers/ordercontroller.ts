import { Request, Response } from 'express';
import { Order } from '../models/order';


export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, totalAmount, status } = req.body;

    if (!customerName || totalAmount == null || !status) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }

    const order = await Order.create({ customerName, totalAmount, status });

    res.status(201).json({
      message: 'Order added successfully',
      orderId: order._id,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// GET /api/orders - Get all orders
export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// PUT /api/orders/:id - Update order status
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json({ message: 'Order updated', order: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// DELETE /api/orders/:id - Delete order
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
