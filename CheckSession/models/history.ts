import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  history: [
    {
      checkIn: { type: Date, required: true },
      checkOut: { type: Date, default: null }
    }
  ]
}, { timestamps: true });

export const HistoryModel = mongoose.model('UserHistory', historySchema);
