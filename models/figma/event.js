const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  timezone: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  format: { type: String, enum: ['Virtual', 'In-Person'], required: true }
});

module.exports = mongoose.model('Event', eventSchema);