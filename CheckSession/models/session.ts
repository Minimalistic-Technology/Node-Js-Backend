import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, default: null }
}, { timestamps: true });

export const SessionModel = mongoose.model('Session', sessionSchema);
