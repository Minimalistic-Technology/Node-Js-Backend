import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthUser', required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  ip: { type: String, required: true }
}, { timestamps: true });


export const LocationModel = mongoose.model('Location', locationSchema);
