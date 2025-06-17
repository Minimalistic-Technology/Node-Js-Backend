import mongoose, { Document, Schema } from 'mongoose';

export interface IBMI extends Document {
  userId: string;
  unit: 'metric' | 'imperial';
  weight: number;
  height: number;
  bmi: number;
  category: string;
  recordedAt: Date;
}

const bmiSchema = new Schema<IBMI>({
  userId: { type: String, required: true },
  unit: { type: String, enum: ['metric', 'imperial'], required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  bmi: { type: Number, required: true },
  category: { type: String, required: true },
  recordedAt: { type: Date, default: Date.now },
});

export const BmiModel = mongoose.model<IBMI>('BMI', bmiSchema);
