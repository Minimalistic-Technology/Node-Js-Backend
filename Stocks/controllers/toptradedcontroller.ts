import { Request, Response } from 'express';
import TopTradedModel, { ITopTradedInput } from '../models/toptraded';

// Add single or multiple top traded stocks
export const addTopStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: ITopTradedInput[] = Array.isArray(req.body) ? req.body : [req.body];
    const result = await TopTradedModel.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all top traded stocks (selected fields only)
export const getTopStocks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await TopTradedModel.find({}, 'name price change image');
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get top traded stock by ID (excluding specific fields)
export const getTopStockById = async (req: Request, res: Response): Promise<void> => {
  try {
    const stock = await TopTradedModel.findById(req.params.id, '-name -price -change -image -__v');
    if (!stock) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json(stock);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update top traded stock by ID
export const updateTopStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await TopTradedModel.findByIdAndUpdate(req.params.id, req.body, {
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

// Delete top traded stock by ID
export const deleteTopStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await TopTradedModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
