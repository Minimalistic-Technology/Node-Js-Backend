const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  image: { type: String },
  date: { type: Date, required: true, default: Date.now }, // Changed to Date type
  author: { type: String },
  tags: [{ type: String }],
  rating: { type: Number, default: 0, min: 0 },
  minutes: { type: Number, min: 1, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verified: { type: Boolean, default: false },
  paraphrased: { type: String },
  views: { type: Number, default: 0, min: 0 } // New field for tracking views
});
module.exports = mongoose.model('Blog', blogSchema);