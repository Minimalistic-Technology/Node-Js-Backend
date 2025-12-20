import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  leadOwner: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const leadSchema = new Schema<ILead>(
  {
    leadOwner: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export const LeadModel = mongoose.models.Lead || mongoose.model<ILead>("Lead", leadSchema);
