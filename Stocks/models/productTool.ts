import mongoose, { Document, Schema } from 'mongoose';

export interface ProductToolDocument extends Document {
  name: string;
  icon: string;
}

const productToolSchema: Schema<ProductToolDocument> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

const ProductTool = mongoose.model<ProductToolDocument>('ProductTool', productToolSchema);

export default ProductTool;
