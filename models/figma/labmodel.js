const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  researchArea: {
    type: String,
    required: true
  },
  researchers: {
    type: [String],
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  publications: {
    type: [String],
    required: true
  }
}, { timestamps: true });

const Lab = mongoose.model('Lab', labSchema);

module.exports = Lab;