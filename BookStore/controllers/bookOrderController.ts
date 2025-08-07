import { Request, Response } from "express";
import { Order } from "../models/order"; 
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      email,
      mobileNumber,
      address,
      paymentType,
      price,
      quantity,
      amount,
      status,
      condition,
      bookId,
      date,
    } = req.body;

    if (!customerName || !email || !mobileNumber || !address || !paymentType || !quantity || !price || !status || !condition || !bookId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const newOrder = new Order({
      customerName,
      email,
      mobileNumber,
      address,
      paymentType,
      quantity,
      price,
      status,
      condition,
      bookId,
      date: date || Date.now(), 
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ order: savedOrder });
  } catch (error: any) {
    res.status(400).json({ error: "Failed to create order", details: error });
  }
};


export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};


export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order);
};


export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!updated) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(updated);
};


export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const deleted = await Order.findByIdAndDelete(id);
  if (!deleted) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json({ message: "Order deleted successfully" });
};


export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updated = await Order.findByIdAndUpdate(id, { status: "Cancelled" }, { new: true });
  if (!updated) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(updated);
};


export const refundOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updated = await Order.findByIdAndUpdate(id, { status: "Refunded" }, { new: true });
  if (!updated) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json({ message: `Refund processed for order #${updated._id}` });
};