import mongoose, { Document, Schema } from 'mongoose';

// Define TypeScript interface for Doctor
export interface DoctorDocument extends Document {
  name: string;
  specialist: string;
  location: string;
  photo: string;
  qualifications: string[];
  experience?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const doctorSchema = new Schema<DoctorDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  specialist: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String,
    required: true,
    trim: true,
  },
  qualifications: {
    type: [String],
    default: [],
  },
  experience: {
    type: String,
    trim: true,
  },
  contact: {
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  bio: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

// Create and export the model
export const Doctor = mongoose.model<DoctorDocument>('Doctor', doctorSchema);
