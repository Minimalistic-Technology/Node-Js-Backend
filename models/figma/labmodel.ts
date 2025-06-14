import mongoose, { Document, Schema, Model } from 'mongoose';

// TypeScript interface for Lab document
export interface LabDocument extends Document {
  name: string;
  researchArea: string;
  researchers: string[];
  contact: string;
  publications: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const labSchema: Schema<LabDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    researchArea: {
      type: String,
      required: true,
    },
    researchers: {
      type: [String],
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    publications: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

// Model definition
export const Lab: Model<LabDocument> = mongoose.model<LabDocument>('Lab', labSchema);
