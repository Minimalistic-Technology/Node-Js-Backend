import { Request, Response } from "express";
import { BookOrderModel } from "../models/bookOrder";

// CREATE
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, amount, date, status } = req.body;
    const newOrder = new BookOrderModel({ customerName, amount, date, status });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ error: "Failed to create order", details: error });
  }
};

// READ ALL
export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  const orders = await BookOrderModel.find().sort({ createdAt: -1 });
  res.json(orders);
};

// READ ONE
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const order = await BookOrderModel.findById(id);
  if (!order)  res.status(404).json({ error: "Order not found" });
  res.json(order);
};

// UPDATE STATUS
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await BookOrderModel.findByIdAndUpdate(id, { status }, { new: true });
  if (!updated)  res.status(404).json({ error: "Order not found" });
  res.json(updated);
};

// DELETE ORDER
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const deleted = await BookOrderModel.findByIdAndDelete(id);
  if (!deleted)  res.status(404).json({ error: "Order not found" });
  res.json({ message: "Order deleted successfully" });
};

// CANCEL ORDER
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updated = await BookOrderModel.findByIdAndUpdate(id, { status: "Cancelled" }, { new: true });
  if (!updated)  res.status(404).json({ error: "Order not found" });
  res.json(updated);
};

// REFUND ORDER
export const refundOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updated = await BookOrderModel.findByIdAndUpdate(id, { status: "Refunded" }, { new: true });
  if (!updated)  res.status(404).json({ error: "Order not found" });
  res.json({ message: `Refund processed for order #${updated._id}` });
};
