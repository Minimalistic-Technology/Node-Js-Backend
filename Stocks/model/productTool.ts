import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ProductToolDocument extends Document {
  name: string;
  icon: string;
}

const productToolSchema = new Schema<ProductToolDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ProductTool: Model<ProductToolDocument> = mongoose.model<ProductToolDocument>(
  'ProductTool',
  productToolSchema
);

export default ProductTool;
