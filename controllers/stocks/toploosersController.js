const Stock = require('../../models/stocks/toploosersModel');
// Add one or multiple stocks
exports.createStock = async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const result = await Stock.insertMany(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all top losers categorized
exports.getTopLosers = async (req, res) => {
  try {
    res.status(200).json({
      large: 'large',
      mid: 'mid',
      small: 'small'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all stocks by category with basic info (name, price, change, image)
exports.getStocksByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!['large', 'mid', 'small'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const stocks = await Stock.find(
      { category },
      'name price change image'
    );

    if (!stocks.length) {
      return res.status(404).json({ error: 'No stocks found in this category' });
    }

    res.status(200).json({ category, stocks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get full stock details by category and stock ID
exports.getStockDetails = async (req, res) => {
  try {
    const { category, id } = req.params;

    if (!['large', 'mid', 'small'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const stock = await Stock.findOne(
      { _id: id, category },
      '-name -price -change -image -__v'
    );

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found in this category' });
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
    if (!updated) return res.status(404).json({ error: 'Stock not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete stock by ID
exports.deleteStock = async (req, res) => {
  try {
    const deleted = await Stock.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Stock not found' });
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
