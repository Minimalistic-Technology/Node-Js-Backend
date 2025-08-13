import mongoose, { Schema, Document } from "mongoose";

export interface IFitnessProfile extends Document {
  username: string;
  email: string;
  phone?: string;
  description?: string;
  favourites: mongoose.Types.ObjectId[]; // workout IDs
}

const FitnessProfileSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    description: { type: String },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workout" }],
  },
  { timestamps: true }
);

export default mongoose.model<IFitnessProfile>("FitnessProfile", FitnessProfileSchema);
