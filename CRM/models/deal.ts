import mongoose from "mongoose";

const dealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  stage: { type: String, required: true },
  closeDate: { type: Date, required: true },
  dealValue: { type: Number, required: true },
});

export const DealModel = mongoose.model("Deal", dealSchema);
