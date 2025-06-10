const mongoose = require('mongoose');

const alphabetSchema = new mongoose.Schema({
  letter: { type: String, required: true, uppercase: true, unique: true, enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'] }
});

module.exports = mongoose.model('Alphabet', alphabetSchema);