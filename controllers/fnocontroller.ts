import { Request, Response } from 'express';
import topStock, { IFOStock } from '../models/FOStock'; // Adjust path and interface if needed

// Add single or multiple top stocks
export const addTopStocks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data: IFOStock[] = Array.isArray(req.body) ? req.body : [req.body];
    const result = await topStock.insertMany(data);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all top stocks (only selected fields)
export const getTopStocks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data = await topStock.find({}, 'name price change icon volume');
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get top stock by ID (excluding selected fields)
export const getTopStockById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const stock = await topStock.findById(req.params.id, '-name -price -change -image -__v');
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    return res.status(200).json(stock);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Update top stock by ID
export const updateTopStock = async (req: Request, res: Response): Promise<Response> => {
  try {
    const updated = await topStock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Stock not found' });
    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete top stock by ID
export const deleteTopStock = async (req: Request, res: Response): Promise<Response> => {
  try {
    const deleted = await topStock.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Stock not found' });
    return res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Update stock by name
export const updateStockByName = async (req: Request, res: Response): Promise<Response> => {
  try {
    const updated = await topStock.findOneAndUpdate(
      { name: req.params.name },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Stock not found' });

    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
