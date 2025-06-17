import { Request, Response } from 'express';
import Stock from '../../models/stocks/topmarketModel';

// Create stock(s)
export const createStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const result = await Stock.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all stocks (basic info only)
export const getAllStocks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Stock.find({}, 'name price change image');
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get full stock details by ID (excluding basic info)
export const getStockDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const stock = await Stock.findById(req.params.id, '-name -price -change -image -__v');
    if (!stock) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json(stock);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update stock by ID
export const updateStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Stock.findByIdAndUpdate(req.params.id, req.body, {
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

// Delete stock by ID
export const deleteStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Stock.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update stock by name
export const updateStockByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Stock.findOneAndUpdate(
      { name: req.params.name },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
