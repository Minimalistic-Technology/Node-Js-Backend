import { Request, Response } from 'express';
import ProductPrice from '../models/ProductPrice';

export const createProductPrice = async (req: Request, res: Response) => {
  try {
    const price = new ProductPrice(req.body);
    await price.save();
    res.status(201).json(price);
  } catch {
    res.status(400).json({ error: 'Failed to create pricing' });
  }
};

export const getAllProductPrices = async (_req: Request, res: Response) => {
  try {
    const prices = await ProductPrice.find();
    res.json(prices);
  } catch {
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
};

export const updateProductPrice = async (req: Request, res: Response) => {
  try {
    const updated = await ProductPrice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Price record not found' });
      return;
    }
    res.json(updated);
  } catch {
    res.status(400).json({ error: 'Failed to update price' });
  }
};

export const deleteProductPrice = async (req: Request, res: Response) => {
  try {
    const deleted = await ProductPrice.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Price record not found' });
      return;
    }
    res.json({ message: 'Price record deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete price record' });
  }
};
