import { Request, Response } from 'express';
import { OrderModel } from '../models/AgarbattiOrder';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = new OrderModel(req.body);
    console.log('Creating order with data:', req.body); // ✅ Log the request body for debugging
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error); // ✅ Log the error for debugging
    res.status(500).json({ message: 'Error creating order', error });
  }
};

export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await OrderModel.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return; // ✅ prevent further execution
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) {
      res.status(404).json({ message: 'Order not found' });
      return; // ✅ prevent further execution
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedOrder = await OrderModel.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      res.status(404).json({ message: 'Order not found' });
      return; // ✅ prevent further execution
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};