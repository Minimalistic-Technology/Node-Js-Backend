import mongoose, { Schema, Document } from "mongoose";

export interface IDeal extends Document {
  name: string;
  company: string;
  stage: string;
  closeDate: Date;
  dealValue: number;
}

const dealSchema = new Schema<IDeal>(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    stage: { type: String, required: true },
    closeDate: { type: Date, required: true },
    dealValue: { type: Number, required: true },
  },
  { timestamps: true }
);

export const DealModel = mongoose.models.Deal || mongoose.model<IDeal>("Deal", dealSchema);
