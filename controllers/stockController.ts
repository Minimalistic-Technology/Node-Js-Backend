import { Request, Response } from 'express';

import Index from '../models/Index';
import MostTraded from '../models/MostTraded';
import Investment from '../models/Investment';
import Watchlist from '../models/Watchlist';
import FOStock from '../models/FOStock';
import TopIndexFuture from '../models/TopIndexFuture';
import TopStockFuture from '../models/TopStockFuture';
import TopTradedIndexFuture from '../models/topTradedIndexFuture';

// Generic CRUD Handler
const handleError = (res: Response, message: string, status = 400) =>
  res.status(status).json({ error: message });

// ----- Index -----
export const getIndices = async (_: Request, res: Response) => {
  try {
    const data = await Index.find();
    res.json(data);
  } catch {
    handleError(res, 'Failed to fetch indices', 500);
  }
};

export const postIndices = async (req: Request, res: Response) => {
  try {
    const index = new Index(req.body);
    await index.save();
    res.status(201).json(index);
  } catch {
    handleError(res, 'Failed to add index');
  }
};

export const putIndices = async (req: Request, res: Response) => {
  try {
    const updated = await Index.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    handleError(res, 'Failed to update index');
  }
};

export const deleteIndices = async (req: Request, res: Response) => {
  try {
    await Index.findByIdAndDelete(req.params.id);
    res.json({ message: 'Index deleted successfully' });
  } catch {
    handleError(res, 'Failed to delete index');
  }
};

// ----- Most Traded -----
export const getMostTraded = async (_: Request, res: Response) => {
  try {
    const data = await MostTraded.find();
    res.json(data);
  } catch {
    handleError(res, 'Failed to fetch most traded stocks', 500);
  }
};

export const postMostTraded = async (req: Request, res: Response) => {
  try {
    const stock = new MostTraded(req.body);
    await stock.save();
    res.status(201).json(stock);
  } catch {
    handleError(res, 'Failed to add most traded stock');
  }
};

export const putMostTraded = async (req: Request, res: Response) => {
  try {
    const updated = await MostTraded.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    handleError(res, 'Failed to update most traded stock');
  }
};

export const deleteMostTraded = async (req: Request, res: Response) => {
  try {
    await MostTraded.findByIdAndDelete(req.params.id);
    res.json({ message: 'Most traded stock deleted' });
  } catch {
    handleError(res, 'Failed to delete most traded stock');
  }
};

// ----- Investment -----
export const getInvestment = async (_: Request, res: Response) => {
  try {
    const data = await Investment.find();
    res.json(data);
  } catch {
    handleError(res, 'Failed to fetch investment data', 500);
  }
};

export const postInvestment = async (req: Request, res: Response) => {
  try {
    const investment = new Investment(req.body);
    await investment.save();
    res.status(201).json(investment);
  } catch {
    handleError(res, 'Failed to add investment data');
  }
};

export const putInvestment = async (req: Request, res: Response) => {
  try {
    const updated = await Investment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    handleError(res, 'Failed to update investment data');
  }
};

export const deleteInvestment = async (req: Request, res: Response) => {
  try {
    await Investment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Investment data deleted' });
  } catch {
    handleError(res, 'Failed to delete investment data');
  }
};

// ----- Watchlist -----
export const getWatchlists = async (_: Request, res: Response) => {
  try {
    const data = await Watchlist.find();
    res.json(data);
  } catch {
    handleError(res, 'Failed to fetch watchlists', 500);
  }
};

export const postWatchlist = async (req: Request, res: Response) => {
  try {
    const watchlist = new Watchlist(req.body);
    await watchlist.save();
    res.status(201).json(watchlist);
  } catch {
    handleError(res, 'Failed to add watchlist');
  }
};

export const putWatchlist = async (req: Request, res: Response) => {
  try {
    const updated = await Watchlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    handleError(res, 'Failed to update watchlist');
  }
};

export const deleteWatchlist = async (req: Request, res: Response) => {
  try {
    await Watchlist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Watchlist deleted' });
  } catch {
    handleError(res, 'Failed to delete watchlist');
  }
};

// ----- F&O Stock -----
export const getFOStocks = async (_: Request, res: Response) => {
  try {
    const data = await FOStock.find();
    res.json(data);
  } catch {
    handleError(res, 'Failed to fetch F&O stocks', 500);
  }
};

export const postFOStock = async (req: Request, res: Response) => {
  try {
    const stock = new FOStock(req.body);
    await stock.save();
    res.status(201).json(stock);
  } catch {
    handleError(res, 'Failed to add F&O stock');
  }
};

export const putFOStock = async (req: Request, res: Response) => {
  try {
    const updated = await FOStock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    handleError(res, 'Failed to update F&O stock');
  }
};

export const deleteFOStock = async (req: Request, res: Response) => {
  try {
    await FOStock.findByIdAndDelete(req.params.id);
    res.json({ message: 'F&O stock deleted' });
  } catch {
    handleError(res, 'Failed to delete F&O stock');
  }
};

// ----- Top Index Future -----
export const getTopIndexFutures = async (_: Request, res: Response) => {
  try {
    const data = await TopIndexFuture.find();
    res.json(data);
  } catch {
    handleError(res, 'Failed to fetch top index futures', 500);
  }
};

export const postTopIndexFuture = async (req: Request, res: Response) => {
  try {
    const index = new TopIndexFuture(req.body);
    await index.save();
    res.status(201).json(index);
  } catch {
    handleError(res, 'Failed to add index future');
  }
};

export const putTopIndexFuture = async (req: Request, res: Response) => {
  try {
    const updated = await TopIndexFuture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    handleError(res, 'Failed to update index future');
  }
};

export const deleteTopIndexFuture = async (req: Request, res: Response) => {
  try {
    await TopIndexFuture.findByIdAndDelete(req.params.id);
    res.json({ message: 'Index future deleted' });
  } catch {
    handleError(res, 'Failed to delete index future');
  }
};

// ----- Top Stock Future -----
export const getTopStockFutures = async (_: Request, res: Response) => {
  try {
    const data = await TopStockFuture.find();
    res.json(data);
  } catch {
    handleError(res, 'Failed to fetch top stock futures', 500);
  }
};

export const postTopStockFuture = async (req: Request, res: Response) => {
  try {
    const stock = new TopStockFuture(req.body);
    await stock.save();
    res.status(201).json(stock);
  } catch {
    handleError(res, 'Failed to add stock future');
  }
};

export const putTopStockFuture = async (req: Request, res: Response) => {
  try {
    const updated = await TopStockFuture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    handleError(res, 'Failed to update stock future');
  }
};

export const deleteTopStockFuture = async (req: Request, res: Response) => {
  try {
    await TopStockFuture.findByIdAndDelete(req.params.id);
    res.json({ message: 'Stock future deleted' });
  } catch {
    handleError(res, 'Failed to delete stock future');
  }
};

// ----- Top Traded Index Future -----
export const postTopTradedIndexFuture = async (req: Request, res: Response) => {
  try {
    const future = new TopTradedIndexFuture(req.body);
    await future.save();
    res.status(201).json(future);
  } catch {
    handleError(res, 'Failed to add index future');
  }
};

export const getTopTradedIndexFutures = async (_: Request, res: Response) => {
  try {
    const futures = await TopTradedIndexFuture.find();
    res.json(futures);
  } catch {
    handleError(res, 'Failed to fetch index futures');
  }
};

export const putTopTradedIndexFuture = async (req: Request, res: Response) => {
  try {
    const updated = await TopTradedIndexFuture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    handleError(res, 'Failed to update index future');
  }
};

export const deleteTopTradedIndexFuture = async (req: Request, res: Response) => {
  try {
    await TopTradedIndexFuture.findByIdAndDelete(req.params.id);
    res.json({ message: 'Index future deleted' });
  } catch {
    handleError(res, 'Failed to delete index future');
  }
};
