import mongoose, { Document, Schema } from "mongoose";

export interface IBookOrder extends Document {
  customerName: string;
  amount: number;
  date: Date;
  status: string; // e.g. "Pending", "Completed", "Cancelled", "Refunded"
}

const BookOrderSchema = new Schema<IBookOrder>({
  customerName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: "Pending" },
}, { timestamps: true });

export const BookOrderModel =
  mongoose.models.BookOrder || mongoose.model<IBookOrder>("BookOrder", BookOrderSchema);
