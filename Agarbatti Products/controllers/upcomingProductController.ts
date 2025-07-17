import { Request, Response } from 'express';
import { UpcomingProductModel } from '../models/upcomingProduct';

// Create
export const createUpcomingProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = new UpcomingProductModel(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create upcoming product' });
  }
};

// Read All
export const getAllUpcomingProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await UpcomingProductModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming products' });
  }
};

// Read by ID
export const getUpcomingProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await UpcomingProductModel.findById(req.params.id);
    if (!product)  res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching upcoming product' });
  }
};

// Update
export const updateUpcomingProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await UpcomingProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated)  res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product' });
  }
};

// Delete
export const deleteUpcomingProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await UpcomingProductModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete product' });
  }
};
