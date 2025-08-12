import mongoose, { Schema, Document } from 'mongoose';

export interface IHistoryEntry {
  checkIn: Date;
  checkOut: Date | null;
}

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  history: IHistoryEntry[];
}

const historyEntrySchema = new Schema<IHistoryEntry>({
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, default: null }
});

const historySchema = new Schema<IHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'AuthUser',
      required: true
    },
    history: [historyEntrySchema]
  },
  { timestamps: true }
);

export const HistoryModel = mongoose.model<IHistory>('UserHistory', historySchema);
