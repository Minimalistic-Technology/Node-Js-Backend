const mongoose = require('mongoose');

const quoteBlogSchema = new mongoose.Schema({
  quote: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('QuoteBlog', quoteBlogSchema);
