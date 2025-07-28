import { Request, Response } from "express";
import QuoteBlog from "../models/QuoteBlog";

export const createQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const quote = new QuoteBlog(req.body);
    await quote.save();
    res.status(201).json(quote);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getLatestQuotes = async (req: Request, res: Response): Promise<void> => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  try {
    const quotes = await QuoteBlog.find({
      createdAt: { $gte: threeMonthsAgo },
    }).sort({ createdAt: -1 });

    res.json(quotes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
