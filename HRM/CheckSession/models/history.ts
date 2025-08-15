import mongoose, { Schema, Document } from 'mongoose';

export interface ICheckInCheckOut {
  dateTime: Date,
  city: String,
  state: String,
  country: String,
  ip: String
}

export interface IHistoryEntry {
  checkIn: ICheckInCheckOut;
  checkOut: ICheckInCheckOut | null;
}

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  history: IHistoryEntry[];
}

const CheckInCheckOutSchema = new Schema<ICheckInCheckOut>({
  dateTime: { type: Date, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  ip: { type: String, required: true }
}, { _id: false })

const historyEntrySchema = new Schema<IHistoryEntry>({
  checkIn: { type: CheckInCheckOutSchema, required: true },
  checkOut: { type: CheckInCheckOutSchema, default: null }
},
  { timestamps: true });

const historySchema = new Schema<IHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'AuthUser',
      required: true
    },
    history: [historyEntrySchema]
  }
);

export const HistoryModel = mongoose.model<IHistory>('HRMUserHistory', historySchema);
