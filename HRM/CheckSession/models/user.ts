import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  jobTitle?: string;
  department?: string;
  avatarUrl?: string;
  location?: { city: string; country: string };
  managerId?: string;
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    role: { type: String, required: true, default: "employee" },
    jobTitle: { type: String },
    department: { type: String },
    avatarUrl: { type: String },
    location: { city: String, country: String },
    managerId: { type: String },
    customFields: { type: Object },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
