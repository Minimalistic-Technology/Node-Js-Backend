const Index = require('../models/Indices');
const MostTraded = require('../models/MostTraded');
const Investment = require('../models/Investment');
const Watchlist = require('../models/Watchlist');
const FOStock = require('../models/FOStock');
const TopIndexFuture = require('../models/TopIndexFuture');
const TopStockFuture = require('../models/TopStockFuture');
const TopTradedIndexFuture = require('../models/topTradedIndexFuture');

exports.getIndices = async (req, res) => {
  try {
    const data = await Index.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch indices' });
  }
};

exports.postIndices = async (req, res) => {
  try {
    const index = new Index(req.body);
    await index.save();
    res.status(201).json(index);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add index' });
  }
};

exports.putIndices = async (req, res) => {
  try {
    const updated = await Index.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update index' });
  }
};

exports.deleteIndices = async (req, res) => {
  try {
    await Index.findByIdAndDelete(req.params.id);
    res.json({ message: 'Index deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete index' });
  }
};

exports.getMostTraded = async (req, res) => {
  try {
    const data = await MostTraded.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch most traded stocks' });
  }
};

exports.postMostTraded = async (req, res) => {
  try {
    const stock = new MostTraded(req.body);
    await stock.save();
    res.status(201).json(stock);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add most traded stock' });
  }
};

exports.putMostTraded = async (req, res) => {
  try {
    const updated = await MostTraded.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update most traded stock' });
  }
};

exports.deleteMostTraded = async (req, res) => {
  try {
    await MostTraded.findByIdAndDelete(req.params.id);
    res.json({ message: 'Most traded stock deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete most traded stock' });
  }
};

exports.getInvestment = async (req, res) => {
  try {
    const data = await Investment.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch investment data' });
  }
};

exports.postInvestment = async (req, res) => {
  try {
    const investment = new Investment(req.body);
    await investment.save();
    res.status(201).json(investment);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add investment data' });
  }
};

exports.putInvestment = async (req, res) => {
  try {
    const updated = await Investment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update investment data' });
  }
};

exports.deleteInvestment = async (req, res) => {
  try {
    await Investment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Investment data deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete investment data' });
  }
};

exports.getWatchlists = async (req, res) => {
  try {
    const data = await Watchlist.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch watchlists' });
  }
};

exports.postWatchlist = async (req, res) => {
  try {
    const watchlist = new Watchlist(req.body);
    await watchlist.save();
    res.status(201).json(watchlist);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add watchlist' });
  }
};

exports.putWatchlist = async (req, res) => {
  try {
    const updated = await Watchlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update watchlist' });
  }
};

exports.deleteWatchlist = async (req, res) => {
  try {
    await Watchlist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Watchlist deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete watchlist' });
  }
};

exports.getFOStocks = async (req, res) => {
  try {
    const data = await FOStock.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch F&O stocks' });
  }
};

exports.postFOStock = async (req, res) => {
  try {
    const stock = new FOStock(req.body);
    await stock.save();
    res.status(201).json(stock);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add F&O stock' });
  }
};

exports.putFOStock = async (req, res) => {
  try {
    const updated = await FOStock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update F&O stock' });
  }
};

exports.deleteFOStock = async (req, res) => {
  try {
    await FOStock.findByIdAndDelete(req.params.id);
    res.json({ message: 'F&O stock deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete F&O stock' });
  }
};

exports.getTopIndexFutures = async (req, res) => {
  try {
    const data = await TopIndexFuture.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top index futures' });
  }
};

exports.postTopIndexFuture = async (req, res) => {
  try {
    const index = new TopIndexFuture(req.body);
    await index.save();
    res.status(201).json(index);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add index future' });
  }
};

exports.putTopIndexFuture = async (req, res) => {
  try {
    const updated = await TopIndexFuture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update index future' });
  }
};

exports.deleteTopIndexFuture = async (req, res) => {
  try {
    await TopIndexFuture.findByIdAndDelete(req.params.id);
    res.json({ message: 'Index future deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete index future' });
  }
};

exports.getTopStockFutures = async (req, res) => {
  try {
    const data = await TopStockFuture.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top stock futures' });
  }
};

exports.postTopStockFuture = async (req, res) => {
  try {
    const stock = new TopStockFuture(req.body);
    await stock.save();
    res.status(201).json(stock);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add stock future' });
  }
};

exports.putTopStockFuture = async (req, res) => {
  try {
    const updated = await TopStockFuture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update stock future' });
  }
};

exports.deleteTopStockFuture = async (req, res) => {
  try {
    await TopStockFuture.findByIdAndDelete(req.params.id);
    res.json({ message: 'Stock future deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete stock future' });
  }
};

exports.postTopTradedIndexFuture = async (req, res) => {
  try {
    const future = new TopTradedIndexFuture(req.body);
    await future.save();
    res.status(201).json(future);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add index future' });
  }
};

// GET: Get all index futures
exports.getTopTradedIndexFutures = async (req, res) => {
  try {
    const futures = await TopTradedIndexFuture.find();
    res.json(futures);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch index futures' });
  }
};

// PUT: Update one index future by ID
exports.putTopTradedIndexFuture = async (req, res) => {
  try {
    const updated = await TopTradedIndexFuture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update index future' });
  }
};

// DELETE: Delete one index future by ID
exports.deleteTopTradedIndexFuture = async (req, res) => {
  try {
    await TopTradedIndexFuture.findByIdAndDelete(req.params.id);
    res.json({ message: 'Index future deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete index future' });
  }
};