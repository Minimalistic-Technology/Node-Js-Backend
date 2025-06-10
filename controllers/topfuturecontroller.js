const topStock = require('../models/TopStockFuture');

// Add single or multiple top stocks
exports.addTopStocks = async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const result = await topStock.insertMany(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all top stocks (only selected fields)
exports.getTopStocks = async (req, res) => {
  try {
    const data = await topStock.find({}, 'name price change image');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get top stock by ID (excluding selected fields)
exports.getTopStockById = async (req, res) => {
  try {
    const stock = await topStock.findById(req.params.id, '-name -price -change -image -__v');
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update top stock by ID
exports.updateTopStock = async (req, res) => {
  try {
    const updated = await topStock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Stock not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete top stock by ID
exports.deleteTopStock = async (req, res) => {
  try {
    const deleted = await topStock.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Stock not found' });
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
