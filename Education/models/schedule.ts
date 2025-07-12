import mongoose, { Document, Schema } from 'mongoose';

export interface ISchedule extends Document {
  days: string[];
  subject: string;
  startTime: string;
  endTime: string;
  faculty: string;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSchema: Schema = new Schema(
  {
    days: { type: [String], required: true }, // e.g., ["Monday", "Wednesday"]
    subject: { type: String, required: true },
    startTime: { type: String, required: true }, // e.g., "09:00 AM"
    endTime: { type: String, required: true }, // e.g., "10:00 AM"
    faculty: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export default mongoose.model<ISchedule>('Schedule', ScheduleSchema);