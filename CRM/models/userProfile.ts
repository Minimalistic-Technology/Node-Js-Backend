import mongoose, { Document, Schema } from "mongoose";

interface Social {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

interface Personal {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
}

interface Address {
  country: string;
  cityState: string;
  postalCode: string;
  taxId: string;
}

export interface IUserProfile extends Document {
  avatarUrl: string;
  fullName: string;
  role: string;
  location: string;
  social: Social;
  personal: Personal;
  address: Address;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    avatarUrl: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, required: true },
    social: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
    },
    personal: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      bio: String,
    },
    address: {
      country: String,
      cityState: String,
      postalCode: String,
      taxId: String,
    },
  },
  { timestamps: true }
);

export const UserProfileModel =
  mongoose.models.UserProfile || mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
