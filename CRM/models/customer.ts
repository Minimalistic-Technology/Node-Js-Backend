import mongoose, { Document, Schema } from "mongoose";

export type CustomerRole = "prospect" | "active" | "churned";

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  status?: CustomerRole;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    email: { type: String, required: false, lowercase: true, index: true },
    phone: { type: String, required: false, index: true },
    company: { type: String, index: true },
    address: String,
    city: String,
    country: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true },
    status: { type: String, enum: ["prospect", "active", "churned"], default: "prospect", index: true },
    tags: [{ type: String, index: true }],
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);


CustomerSchema.index({ company: 1, status: 1 });
CustomerSchema.index({ email: 1 }, { unique: false, sparse: true });
CustomerSchema.index({ firstName: "text", lastName: "text", company: "text", email: "text" });

export const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);
