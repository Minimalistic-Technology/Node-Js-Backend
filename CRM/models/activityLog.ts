import mongoose, { Document, Schema } from "mongoose";

export interface IActivityLog extends Document {
  customerId: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId; 
  action: string; 
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: { type: String, required: true, index: true },
    details: { type: Schema.Types.Mixed },
    ip: String,
    userAgent: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ActivityLogSchema.index({ customerId: 1, createdAt: -1 });
ActivityLogSchema.index({ actorId: 1, createdAt: -1 });

export const ActivityLog = mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
