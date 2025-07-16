import { Request, Response } from 'express';
import { CheckoutModel } from '../models/checkout';

export const createCheckout = async (req: Request, res: Response): Promise<void> => {
  try {
    const checkout = new CheckoutModel(req.body);
    await checkout.save();
    res.status(201).json(checkout);
  } catch (err) {
    res.status(400).json({ error: 'Checkout creation failed' });
  }
};

export const getCheckouts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const checkouts = await CheckoutModel.find();
    res.json(checkouts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch checkouts' });
  }
};

export const updateCheckout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await CheckoutModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Checkout not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update checkout' });
  }
};

export const deleteCheckout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await CheckoutModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Checkout not found' });
      return;
    }
    res.json({ message: 'Checkout deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete checkout' });
  }
};
