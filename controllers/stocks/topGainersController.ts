import { Request, Response } from 'express';
import Stock from '../../models/stocks/topGainersModel';

// Add one or multiple stocks
export const createStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const result = await Stock.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all top gainers categorized
export const getTopGainers = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      large: 'large',
      mid: 'mid',
      small: 'small'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all stocks by category with basic info
export const getStocksByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;

    if (!['large', 'mid', 'small'].includes(category)) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }

    const stocks = await Stock.find({ category }, 'name price change image');

    if (!stocks.length) {
      res.status(404).json({ error: 'No stocks found in this category' });
      return;
    }

    res.status(200).json({ category, stocks });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get full stock details by category and stock ID
export const getStockDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, id } = req.params;

    if (!['large', 'mid', 'small'].includes(category)) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }

    const stock = await Stock.findOne(
      { _id: id, category },
      '-name -price -change -image -__v'
    );

    if (!stock) {
      res.status(404).json({ error: 'Stock not found in this category' });
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
