import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  name: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  website: { type: String },
  type: { type: String, enum: ["Customer", "Partner", "Vendor", "Other"], required: true },
  revenue: { type: String }, 
});

export const AccountModel = mongoose.model("Account", accountSchema);
