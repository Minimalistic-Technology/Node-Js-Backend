import mongoose, { Schema, Document, models } from 'mongoose';

export interface IContact extends Document {
  name: string;
  dob: string;
  email: string;
  phone: string;
}

const contactSchema = new Schema<IContact>({
  name: { type: String, required: true },
  dob: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }
}, { timestamps: true });

export const ContactModel = models.RegisteredContact || mongoose.model<IContact>('RegisteredContact', contactSchema);