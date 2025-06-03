const mongoose = require('mongoose');

// Define the schema
const topTradedIndexFutureSchema = new mongoose.Schema({
  name: String,
  icon: String,
  lasttraded: String,
  daychange: String
});

// Export the model
module.exports = mongoose.model('TopTradedIndexFuture', topTradedIndexFutureSchema);
