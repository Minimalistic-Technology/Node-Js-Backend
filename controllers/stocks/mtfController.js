const MTFStock = require('../../models/stocks/mtfModel');

// Add single or multiple MTF stocks
exports.addMTFStocks = async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const result = await MTFStock.insertMany(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all MTF stocks (only selected fields)
exports.getAllMTFStocks = async (req, res) => {
  try {
    const data = await MTFStock.find({}, 'name price change image');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get MTF stock by ID (excluding selected fields)
exports.getMTFStockById = async (req, res) => {
  try {
    const stock = await MTFStock.findById(req.params.id, '-name -price -change -image -__v');
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update MTF stock by ID
exports.updateMTFStock = async (req, res) => {
  try {
    const updated = await MTFStock.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated) return res.status(404).json({ error: 'Stock not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete MTF stock by ID
exports.deleteMTFStock = async (req, res) => {
  try {
    const deleted = await MTFStock.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Stock not found' });
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
