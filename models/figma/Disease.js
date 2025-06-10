const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  alphabet: { type: mongoose.Schema.Types.ObjectId, ref: 'Alphabet', required: true },
  name: { type: String, required: true },
  see: { type: String, default: null }
});

module.exports = mongoose.model('Disease', diseaseSchema);