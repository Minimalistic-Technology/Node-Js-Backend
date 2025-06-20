import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  date: string;
  time: string;
  timezone: string;
  title: string;
  location: string;
  format: 'Virtual' | 'In-Person';
}

const eventSchema: Schema = new Schema<IEvent>({
  date: { type: String, required: true },
  time: { type: String, required: true },
  timezone: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  format: { type: String, enum: ['Virtual', 'In-Person'], required: true }
});

export default mongoose.model<IEvent>('Event', eventSchema);
