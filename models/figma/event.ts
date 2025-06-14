import mongoose, { Document, Schema } from 'mongoose';

// Define TypeScript interface for Event
export interface EventDocument extends Document {
  date: string;
  time: string;
  timezone: string;
  title: string;
  location: string;
  format: 'Virtual' | 'In-Person';
}

// Define schema
const eventSchema = new Schema<EventDocument>({
  date: { type: String, required: true },
  time: { type: String, required: true },
  timezone: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  format: {
    type: String,
    enum: ['Virtual', 'In-Person'],
    required: true,
  },
});

// Export model
export const Event = mongoose.model<EventDocument>('Event', eventSchema);
