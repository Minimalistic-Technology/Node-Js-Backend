import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut?: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'AuthUser',
      required: true
    },
    checkIn: {
      type: Date,
      required: true,
      default: Date.now
    },
    checkOut: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export const SessionModel = mongoose.model<ISession>('Session', sessionSchema);
