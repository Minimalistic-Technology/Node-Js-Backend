import { Request, Response } from 'express';
import mongoose from 'mongoose';
import IndexModel, { IIndex } from '../models/Indices';

// Add single or multiple index stocks
export const addTopStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: Partial<IIndex>[] = Array.isArray(req.body) ? req.body : [req.body];
    const result = await IndexModel.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all index stocks (selected fields only)
export const getTopStocks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await IndexModel.find({}, 'name price change image');
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get index stock by ID (excluding specific fields)
export const getTopStockById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const stock = await IndexModel.findById(id, '-name -price -change -image -__v');
    if (!stock) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }

    res.status(200).json(stock);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update index stock by ID
export const updateTopStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const updated = await IndexModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete index stock by ID
export const deleteTopStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const deleted = await IndexModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }

    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
