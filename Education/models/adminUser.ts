import mongoose, { Document, Schema } from "mongoose";

export interface IAdminUser extends Document {
  prNo: string;
  username: string;
  email: string;
  role: "teacher" | "student";
  phone: string;
  yearName: string;
  courseName: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

const AdminUserSchema = new Schema<IAdminUser>({
  prNo: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["teacher", "student"], required: true },
  phone: { type: String, required: true },
  yearName: { type: String, required: true },
  courseName: { type: String, required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

export const AdminUserModel = mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);
