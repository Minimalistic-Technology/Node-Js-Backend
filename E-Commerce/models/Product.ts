import { min } from 'moment';
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  rating: number;
}

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
});

export default mongoose.model<IProduct>('Product', productSchema);
