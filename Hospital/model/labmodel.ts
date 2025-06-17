import mongoose, { Document, Schema } from 'mongoose';

export interface ILab extends Document {
  name: string;
  researchArea: string;
  researchers: string[];
  contact: string;
  publications: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const labSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  researchArea: { type: String, required: true },
  researchers: { type: [String], required: true },
  contact: { type: String, required: true },
  publications: { type: [String], required: true },
}, { timestamps: true });

const Lab = mongoose.model<ILab>('Lab', labSchema);
export default Lab;