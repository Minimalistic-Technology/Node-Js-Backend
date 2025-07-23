import mongoose, { Schema, Document } from "mongoose";

export interface IMeeting extends Document {
  name: string;
  venue: string;
  from: Date;
  to: Date;
  owner?: string;
}

const meetingSchema = new Schema<IMeeting>(
  {
    name: { type: String, required: true },
    venue: { type: String, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    owner: { type: String },
  },
  { timestamps: true }
);

export const MeetingModel =
  mongoose.models.Meeting || mongoose.model<IMeeting>("Meeting", meetingSchema);
