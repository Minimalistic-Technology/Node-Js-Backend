import mongoose, { Schema, Document } from 'mongoose';

export interface ICrmAuthUser extends Document {
  firstname: string;
  lastname: string;
  mobileNumber: string;
  email: string;
  password: string; // hashed password
}

const CrmAuthUserSchema = new Schema<ICrmAuthUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const CrmAuthUserModel = mongoose.models.CrmAuthUser || mongoose.model<ICrmAuthUser>('CrmAuthUser', CrmAuthUserSchema);
