import { Schema, model, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description?: string;
  price?: number;
  createdAt: Date;
}

const courseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export default model<ICourse>('Course', courseSchema);
