import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  venue: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  owner: { type: String },
});

export const MeetingModel = mongoose.model("Meeting", meetingSchema);
