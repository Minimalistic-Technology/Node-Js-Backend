import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  message: string;
  read: boolean;
  type: "account" | "campaign" | "meeting" | "lead" | "deal";
  createdAt: Date;
  readAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["account", "campaign", "meeting", "lead", "deal"],
      required: true,
    },
    read: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Automatically delete notifications 90 days after being marked read
NotificationSchema.index(
  { readAt: 1 },
  {
    expireAfterSeconds: 7776000, // 90 days
    partialFilterExpression: { read: true },
  }
);

export const NotificationModel = mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
