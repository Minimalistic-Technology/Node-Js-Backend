import mongoose, { Schema, Document, Types } from 'mongoose';

/** Category Schema & Interface */
export interface ICategory extends Document {
  name: string;
  books: Types.ObjectId[];
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true },
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
  },
  { timestamps: true }
);

/** Book Schema & Interface */
export interface IBook extends Document {
  bookName: string;
  categoryName: string;
  title: string;
  price: number;
  imageUrl: string;
  subCategory: string;
  description: string;
  viewCount: number;
  estimatedDelivery: string;
  tags: string[];
  condition: 'NEW - ORIGINAL PRICE' | 'OLD - 35% OFF';
  productCategory: string;
  author: string;
  publisher: string;
  isbn: string;
}

const BookSchema: Schema<IBook> = new Schema(
  {
    bookName: { type: String, required: true, unique: true },
    categoryName: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    subCategory: { type: String, required: true },
    description: { type: String, required: true },
    viewCount: { type: Number, required: true, default: 0 },
    estimatedDelivery: { type: String, required: true },
    tags: { type: [String], required: true },
    condition: { type: String, required: true, enum: ['NEW - ORIGINAL PRICE', 'OLD - 35% OFF'] },
    author: { type: String, required: true },
    publisher: { type: String, required: true },
    isbn: { type: String, required: true }
  },
  { timestamps: true }
);

/** Export Models */
/** Export Models */
export const CategoryModel = mongoose.models.BookCategory || mongoose.model<ICategory>('BookCategory', CategorySchema);
export const BookModel = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);