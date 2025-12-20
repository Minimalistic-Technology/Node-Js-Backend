import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IFitnessProfile extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  description?: string;
  favourites: mongoose.Types.ObjectId[];
  comparePassword(password: string): Promise<boolean>;
}

const FitnessProfileSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    description: { type: String },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workout" }],
  },
  { timestamps: true }
);

FitnessProfileSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

FitnessProfileSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IFitnessProfile>("FitnessProfile", FitnessProfileSchema);
