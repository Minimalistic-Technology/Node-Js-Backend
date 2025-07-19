// File: ordercontroller.ts
import { Request, Response } from 'express';
import { Order } from '../../BookStore/models/order';
import { BookModel } from '../../BookStore/models/homepage';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, email, mobileNumber, address, paymentType, quantity, price, status = 'Shipped', condition, bookId } = req.body;

    if (!customerName || !email || !mobileNumber || !address || !address.street || !address.city || !address.state || !address.country || !address.pinCode || !paymentType || quantity == null || price == null || !condition || !bookId) {
      res.status(400).json({ message: 'All fields are required, including bookId.' });
      return;
    }

    const book = await BookModel.findById(bookId);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    if (condition === 'New' && book.quantityNew < quantity) {
      res.status(400).json({ message: `Insufficient new stock. Only ${book.quantityNew} available.` });
      return;
    }
    if (condition === 'Old' && book.quantityOld < quantity) {
      res.status(400).json({ message: `Insufficient old stock. Only ${book.quantityOld} available.` });
      return;
    }
    if (condition === 'New') book.quantityNew -= quantity;
    if (condition === 'Old') book.quantityOld -= quantity;
    await book.save();

    const order = await Order.create({ customerName, email, mobileNumber, address, paymentType, quantity, price, status, condition, bookId });
    res.status(201).json({
      message: 'Order added successfully',
      order: {
        _id: order._id,
        customerName: order.customerName,
        email: order.email,
        mobileNumber: order.mobileNumber,
        address: order.address,
        paymentType: order.paymentType,
        quantity: order.quantity,
        price: order.price,
        status: order.status,
        condition: order.condition,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        date: order.date,
        bookId: order.bookId,
        title: book.title,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().populate('bookId', 'title imageUrl');
    res.status(200).json({
      message: 'Orders retrieved successfully',
      orders: orders.map(order => ({
        _id: order._id,
        customerName: order.customerName,
        email: order.email,
        mobileNumber: order.mobileNumber,
        address: order.address,
        paymentType: order.paymentType,
        quantity: order.quantity,
        price: order.price,
        status: order.status,
        condition: order.condition,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        date: order.date,
        bookId: order.bookId,
        title: order.bookId ? (order.bookId as any).title : 'Unknown Book',
        imageUrl: order.bookId ? (order.bookId as any).imageUrl : null,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).populate('bookId', 'title imageUrl');
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order: {
        _id: order._id,
        customerName: order.customerName,
        email: order.email,
        mobileNumber: order.mobileNumber,
        address: order.address,
        paymentType: order.paymentType,
        quantity: order.quantity,
        price: order.price,
        status: order.status,
        condition: order.condition,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        date: order.date,
        bookId: order.bookId,
        title: order.bookId ? (order.bookId as any).title : 'Unknown Book',
        imageUrl: order.bookId ? (order.bookId as any).imageUrl : null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : 'Unknown error' });
  }
};


export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : 'Unknown error' });
  }
};
