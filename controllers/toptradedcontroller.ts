import { Request, Response } from 'express';
import { Document, Types } from 'mongoose';
import topStock from '../models/toptraded';

// Define a TypeScript interface for a top traded stock document
interface TopTradedStock extends Document {
  _id: Types.ObjectId;
  name: string;
  price: number;
  change: number;
  image: string;
  [key: string]: any;
}

// Add single or multiple top traded stocks
export const addTopStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: Partial<TopTradedStock>[] = Array.isArray(req.body) ? req.body : [req.body];
    const result = await topStock.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all top traded stocks (only selected fields)
export const getTopStocks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await topStock.find({}, 'name price change image');
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific top traded stock by ID (excluding sensitive fields)
export const getTopStockById = async (req: Request, res: Response): Promise<void> => {
  try {
    const stock = await topStock.findById(req.params.id, '-name -price -change -image -__v');
    if (!stock) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json(stock);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a specific top traded stock by ID
export const updateTopStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await topStock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific top traded stock by ID
export const deleteTopStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await topStock.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
