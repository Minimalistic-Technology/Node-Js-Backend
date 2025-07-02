import mongoose, { Schema, Document } from 'mongoose';

interface PaymentDetailsCard {
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentDetailsUPI {
  upiId: string;
}

interface User {
  fullName: string;
  contact: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface IOrder extends Document {
  user: User;
  paymentMethod: 'card' | 'upi';
  paymentDetails: PaymentDetailsCard | PaymentDetailsUPI | null;
  items: any[]; 
  subtotal: number;
  status: string;
}

const OrderSchema: Schema = new Schema({
  user: {
    fullName: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, enum: ['card', 'upi'], required: true },
  paymentDetails: { type: Schema.Types.Mixed, required: false },
  items: { type: [Schema.Types.Mixed], required: true },
  subtotal: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);