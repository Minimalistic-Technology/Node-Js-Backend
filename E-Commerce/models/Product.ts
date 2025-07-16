import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  image: string;
  category: string;
}

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  category: { type: String, required: true },
});

export default mongoose.model<IProduct>('Product', productSchema);
