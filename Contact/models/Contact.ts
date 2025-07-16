import mongoose, { Document, Schema, model } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  details?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    service: { type: String },
    details: { type: String },
  },
  { timestamps: true }
);

export default model<IContact>('Contact', contactSchema);
