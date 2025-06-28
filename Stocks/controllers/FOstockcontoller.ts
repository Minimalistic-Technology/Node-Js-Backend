import { Request, Response } from 'express';
import FOStock, { IFOStock } from '../models/FOStock';

// Add single or multiple top stocks
export const addTopStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: Partial<IFOStock>[] = Array.isArray(req.body) ? req.body : [req.body];
    const result = await FOStock.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all top stocks (only selected fields)
export const getTopStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await FOStock.find({}, 'name price change icon volume');
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get top stock by ID
export const getTopStockById = async (req: Request, res: Response): Promise<void> => {
  try {
    const stock = await FOStock.findById(req.params.id, '-name -price -change -image -__v');
    if (!stock) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json(stock);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update top stock by ID
export const updateTopStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await FOStock.findByIdAndUpdate(req.params.id, req.body, {
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

// Delete top stock by ID
export const deleteTopStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await FOStock.findByIdAndDelete(req.params.id);
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
    const updated = await FOStock.findOneAndUpdate(
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
