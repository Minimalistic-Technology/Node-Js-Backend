import mongoose, { Document, Schema } from 'mongoose';

export interface ISymptom extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SymptomSchema = new Schema<ISymptom>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model<ISymptom>('Symptom', SymptomSchema);
