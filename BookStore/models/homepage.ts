import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  bookName: string;
  categoryName: string;
  subCategory?: string;
  subSubCategory?: string;
  title: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  price?: number;
  description?: string;
  estimatedDelivery?: string;
  condition?: string;
  author?: string;
  publisher?: string;
  imageUrl?: string;
  quantityNew?: number;
  quantityOld?: number;
  discountNew?: number;
  discountOld?: number;
  effectiveDiscount?: number;
  discountedPrice?: number;
}

export interface ISubCategory {
  name: string;
  subSubCategories: string[];
  books: mongoose.Types.ObjectId[];
  subCategoryDiscount?: number;
}

export interface IBookCategory extends Document {
  name: string;
  subCategories: ISubCategory[];
  books: mongoose.Types.ObjectId[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  categoryDiscount?: number;
}

export interface IClothingCategory extends Document {
  name: string;
  gender: string;
  dresses: mongoose.Types.ObjectId[];
}

const BookCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    subCategories: [
      {
        name: { type: String, required: true },
        subSubCategories: [{ type: String }],
        books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
        subCategoryDiscount: { type: Number, default: 0 },
      },
    ],
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }], // Added top-level books field
    tags: [{ type: String }],
    seoTitle: { type: String },
    seoDescription: { type: String },
    categoryDiscount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BookSchema: Schema = new Schema(
  {
    bookName: { type: String, required: true },
    categoryName: { type: String, required: true, index: true },
    subCategory: { type: String, index: true },
    subSubCategory: { type: String, index: true },
    title: { type: String, required: true },
    tags: [{ type: String }],
    seoTitle: { type: String },
    seoDescription: { type: String },
    price: { type: Number },
    description: { type: String },
    estimatedDelivery: { type: String },
    condition: { type: String },
    author: { type: String },
    publisher: { type: String },
    imageUrl: { type: String },
    quantityNew: { type: Number, default: 0 },
    quantityOld: { type: Number, default: 0 },
    discountNew: { type: Number, default: 0 },
    discountOld: { type: Number, default: 0 },
    effectiveDiscount: { type: Number, default: 0 },
    discountedPrice: { type: Number },
  },
  { timestamps: true }
);

const ClothingCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true, enum: ['men', 'women'] },
    dresses: [{ type: Schema.Types.ObjectId, ref: 'Dress' }],
  },
  { timestamps: true, collection: 'Category' }
);

export const BookModel = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
export const BookCategoryModel = mongoose.models.BookCategory || mongoose.model<IBookCategory>('BookCategory', BookCategorySchema);
export const ClothingCategoryModel = mongoose.models.Category || mongoose.model<IClothingCategory>('Category', ClothingCategorySchema);