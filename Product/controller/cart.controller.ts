import { Request, Response } from 'express';
import { CartModel } from '../models/cart.model';

export const addToCart = async (req: Request, res: Response) => {
  try {
    const cartItem = new CartModel(req.body);
    const saved = await cartItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Error adding to cart' });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const items = await CartModel.find({ userId: req.params.userId });
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Error fetching cart' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const updated = await CartModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Cart item not found' });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Error updating cart' });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const deleted = await CartModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch {
    res.status(500).json({ error: 'Error deleting cart item' });
  }
};
