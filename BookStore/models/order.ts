import mongoose, { Schema, Document } from 'mongoose';

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface IOrder extends Document {
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema<IOrder>(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
