import mongoose, { Schema, Document } from 'mongoose';

export interface IProductPrice extends Document {
  productId: mongoose.Types.ObjectId;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
}

const productPriceSchema: Schema = new Schema({
  productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  discountPercent: { type: Number, required: true },
});

export default mongoose.model<IProductPrice>('ProductPrice', productPriceSchema);
