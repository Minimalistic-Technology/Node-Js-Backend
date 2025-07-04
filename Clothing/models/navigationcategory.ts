import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDress extends Document {
  name: string;
  image: string;
  price: number;
  colors: string[];
  about: string;
  gender: 'men' | 'women';
  isCommon: boolean;
  productCategory: string; 
}

const DressSchema: Schema<IDress> = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    colors: [{ type: String, required: true }],
    about: { type: String, required: true },
    gender: { type: String, enum: ['men', 'women'], required: true },
    isCommon: { type: Boolean, default: false },
    productCategory: { type: String, required: true },
  },
  { timestamps: true }
);

export interface ICategory extends Document {
  name: string;
  gender: 'men' | 'women';
  dresses: Types.ObjectId[]; 
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, enum: ['men', 'women'], required: true },
    dresses: [{ type: Schema.Types.ObjectId, ref: 'Dress' }]  // ✅ added this
  },
  { timestamps: true }
);

export const DressModel = mongoose.model<IDress>('Dress', DressSchema);
export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);
