const Stock = require('../../models/stocks/topmarketModel');

// Create stock(s)
exports.createStock = async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const result = await Stock.insertMany(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all stocks (basic info only)
exports.getAllStocks = async (req, res) => {
  try {
    const data = await Stock.find({}, 'name price change image');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get full stock details by ID (excluding basic info)
exports.getStockDetails = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id, '-name -price -change -image -__v');
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update stock by ID
exports.updateStock = async (req, res) => {
  try {
    const updated = await Stock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete stock by ID
exports.deleteStock = async (req, res) => {
  try {
    const deleted = await Stock.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update stock by name
exports.updateStockByName = async (req, res) => {
  try {
    const updated = await Stock.findOneAndUpdate(
      { name: req.params.name },      // Find stock by name
      req.body,                       // Update data (e.g., { image: "..." })
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

