import mongoose from "mongoose";

const eventTrackSchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  eventName: { type: String, required: true },
  ip: String,
  city: String,
  country: String,
  timestamp: { type: Date, default: Date.now }
});

export const EventTrackModel = mongoose.model("EventTrack", eventTrackSchema);
