import mongoose, { Document, Schema } from 'mongoose';

export interface ICart extends Document {
  userId: string;
  productId: string;
  quantity: number;
}

const cartSchema = new Schema<ICart>({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, default: 1 }
}, { timestamps: true });

export const CartModel = mongoose.model<ICart>('Cart', cartSchema);
