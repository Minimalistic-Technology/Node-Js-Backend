import mongoose, { Document, Schema } from 'mongoose';

// Define TypeScript interface for Contact
export interface ContactDocument extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
}

// Define schema
const contactSchema = new Schema<ContactDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

// Export model
export const Contact = mongoose.model<ContactDocument>('Contact', contactSchema);
