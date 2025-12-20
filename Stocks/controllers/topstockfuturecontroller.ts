import { Request, Response } from 'express';
import TopStockFutureModel, { ITopStockFuture } from '../models/TopStockFuture';


export const addTopStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: Partial<ITopStockFuture>[] = Array.isArray(req.body) ? req.body : [req.body];
    const result = await TopStockFutureModel.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const getTopStocks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await TopStockFutureModel.find({}, 'name price change image');
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const getTopStockById = async (req: Request, res: Response): Promise<void> => {
  try {
    const stock = await TopStockFutureModel.findById(req.params.id, '-name -price -change -image -__v');
    if (!stock) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json(stock);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const updateTopStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await TopStockFutureModel.findByIdAndUpdate(req.params.id, req.body, {
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


export const deleteTopStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await TopStockFutureModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
