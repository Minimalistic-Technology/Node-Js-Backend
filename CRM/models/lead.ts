import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  leadOwner: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true }
}, { timestamps: true });

export const LeadModel = mongoose.model("Lead", leadSchema);
