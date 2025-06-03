const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  name: String,
  icon: String,
});

module.exports = mongoose.model('Collection', CollectionSchema);
