import mongoose, { Document, Schema } from 'mongoose';

export interface ICheckout extends Document {
  userId: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  paymentMethod: string;
}

const checkoutSchema = new Schema<ICheckout>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  paymentMethod: { type: String, required: true }
}, { timestamps: true });

export const CheckoutModel = mongoose.model<ICheckout>('Checkout', checkoutSchema);