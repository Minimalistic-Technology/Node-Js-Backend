const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    name: String,
    itemCount: Number
});

module.exports = mongoose.model('Watchlist', watchlistSchema);