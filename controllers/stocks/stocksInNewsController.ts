import { Request, Response } from 'express';
import StocksInNews from '../../models/stocks/StocksInNews';

// Add stock(s)
export const addStocksInNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const result = await StocksInNews.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all stocks (only selected fields)
export const getAllStocksInNews = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await StocksInNews.find({}, 'name price change image');
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get stock by ID (excluding selected fields)
export const getStockInNewsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const stock = await StocksInNews.findById(req.params.id, '-name -price -change -image -__v');
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
export const updateStocksInNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await StocksInNews.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
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
export const deleteStocksInNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await StocksInNews.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
