const QuoteBlog = require('../models/QuoteBlog');

exports.createQuote = async (req, res) => {
  try {
    const quote = new QuoteBlog(req.body);
    await quote.save();
    res.status(201).json(quote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLatestQuotes = async (req, res) => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  try {
    const quotes = await QuoteBlog.find({
      createdAt: { $gte: threeMonthsAgo }
    }).sort({ createdAt: -1 });

    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
