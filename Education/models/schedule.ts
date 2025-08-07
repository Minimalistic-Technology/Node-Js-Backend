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
    days: { type: [String], required: true }, 
    subject: { type: String, required: true },
    startTime: { type: String, required: true }, 
    endTime: { type: String, required: true }, 
    faculty: { type: String, required: true },
  },
  { timestamps: true } 
);

export default mongoose.model<ISchedule>('Schedule', ScheduleSchema);