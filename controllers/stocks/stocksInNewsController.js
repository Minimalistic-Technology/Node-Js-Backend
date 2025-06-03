const StocksInNews = require ('../../models/stocks/StocksInNews');

// Add stock(s)
exports.addStocksInNews = async (req, res) => {
  try {
    const data = Array.isArray (req.body) ? req.body : [req.body];
    const result = await StocksInNews.insertMany (data);
    res.status (201).json (result);
  } catch (error) {
    res.status (500).json ({error: error.message});
  }
};

// Get all stocks
exports.getAllStocksInNews = async (req, res) => {
  try {
    const data = await StocksInNews.find({}, 'name price change image');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get stock by ID
exports.getStockInNewsById = async (req, res) => {
  try {
    const stock = await StocksInNews.findById(req.params.id, '-name -price -change -image -__v');
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update stock by ID
exports.updateStocksInNews = async (req, res) => {
  try {
    const updated = await StocksInNews.findByIdAndUpdate (
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updated) return res.status (404).json ({error: 'Stock not found'});
    res.status (200).json (updated);
  } catch (error) {
    res.status (500).json ({error: error.message});
  }
};

// Delete stock by ID
exports.deleteStocksInNews = async (req, res) => {
  try {
    const deleted = await StocksInNews.findByIdAndDelete (req.params.id);
    if (!deleted) return res.status (404).json ({error: 'Stock not found'});
    res.status (200).json ({message: 'Stock deleted successfully'});
  } catch (error) {
    res.status (500).json ({error: error.message});
  }
};