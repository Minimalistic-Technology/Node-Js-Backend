import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  bookName: string;
  categoryName: string;
  title: string;
  price: number;
  imageUrl: string;
  subCategory: string;
  description: string;
  estimatedDelivery: string;
  tags: string[];
  condition: string;
  author: string;
  publisher: string;
  quantityNew: number;
  quantityOld: number;
  discountNew: number;
  discountOld: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface IBookCategory extends Document {
  name: string;
  books: mongoose.Types.ObjectId[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface IClothingCategory extends Document {
  name: string;
  gender: string;
  dresses: mongoose.Types.ObjectId[];
}

const BookSchema: Schema = new Schema({
  bookName: { type: String, required: true, unique: true },
  categoryName: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  subCategory: { type: String, required: true },
  description: { type: String, required: true },
  estimatedDelivery: { type: String, required: true },
  tags: { type: [String], required: true },
  condition: { type: String, required: true, enum: ['NEW - ORIGINAL PRICE', 'OLD ', 'BOTH'] },
  author: { type: String, required: true },
  publisher: { type: String, required: true },
  quantityNew: { type: Number, required: true, default: 0 },
  quantityOld: { type: Number, required: true, default: 0 },
  discountNew: { type: Number, default: 0, min: 0, max: 100 },
  discountOld: { type: Number, default: 0, min: 0, max: 100 },
  seoTitle: { type: String, required: false },
  seoDescription: { type: String, required: false },
}, { timestamps: true });

const BookCategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
  tags: { type: [String], default: [] },
  seoTitle: { type: String, required: false },
  seoDescription: { type: String, required: false },
}, { timestamps: true, collection: 'BookCategories' });

const ClothingCategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true, enum: ['men', 'women'] },
  dresses: [{ type: Schema.Types.ObjectId, ref: 'Dress' }],
}, { timestamps: true, collection: 'Category' });

export const BookModel = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
export const BookCategoryModel = mongoose.models.BookCategory || mongoose.model<IBookCategory>('BookCategory', BookCategorySchema);
export const ClothingCategoryModel = mongoose.models.Category || mongoose.model<IClothingCategory>('Category', ClothingCategorySchema);