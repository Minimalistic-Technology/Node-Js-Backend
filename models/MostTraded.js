const mongoose = require('mongoose');

const tradedSchema = new mongoose.Schema({
  name: String,
  icon: String,
  lasttraded: String,
  daychange: String
});

module.exports = mongoose.model('MostTraded', tradedSchema);
