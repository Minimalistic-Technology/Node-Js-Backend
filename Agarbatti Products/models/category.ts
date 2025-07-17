import mongoose, { Schema, Document } from 'mongoose';

export interface IProductCategory extends Document {
  name: string;
  image: string;
  featured: boolean;
  codAvailable: boolean;
}

const productCategorySchema = new Schema<IProductCategory>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
    codAvailable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ProductCategoryModel = mongoose.model<IProductCategory>('ProductCategory', productCategorySchema);
