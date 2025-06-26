import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  productId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  related: string[];
}

const productSchema = new Schema<IProduct>(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    related: [{ type: String, ref: 'Product' }],
  },
  { timestamps: true, }
);

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
