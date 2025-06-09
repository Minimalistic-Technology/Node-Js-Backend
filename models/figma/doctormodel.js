const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialist: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    required: true, // URL to the doctor's photo
    trim: true
  },
  qualifications: {
    type: [String], // Array of qualifications (e.g., ["MBBS", "MD"])
    default: []
  },
  experience: {
    type: String, // e.g., "10 years"
    trim: true
  },
  contact: {
    email: { type: String, trim: true },
    phone: { type: String, trim: true }
  },
  bio: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);