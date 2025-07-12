import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  specialist: string;
  location: string;
  photo: string;
  qualifications: string[];
  experience?: string;
  contact: {
    email?: string;
    phone?: string;
  };
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true, trim: true },
  specialist: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  photo: { type: String, required: true, trim: true },
  qualifications: { type: [String], default: [] },
  experience: { type: String, trim: true },
  contact: {
    email: { type: String, trim: true },
    phone: { type: String, trim: true }
  },
  bio: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDoctor>('Doctor', doctorSchema);
