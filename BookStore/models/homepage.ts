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
}

export interface ISubCategory {
  name: string;
  subSubCategories: string[];
  books: mongoose.Types.ObjectId[];
  subCategoryDiscount?: number; // New field for subcategory discount
}

export interface IBookCategory extends Document {
  name: string;
  subCategories: ISubCategory[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  categoryDiscount?: number; // New field for category discount
}
export interface IClothingCategory extends Document {
  name: string;
  gender: string;
  dresses: mongoose.Types.ObjectId[];
}

const BookCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    subCategories: [
      {
        name: { type: String, required: true },
        subSubCategories: [{ type: String }],
        books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
        subCategoryDiscount: { type: Number, default: 0 }, // Added
      },
    ],
    tags: [{ type: String }],
    seoTitle: { type: String },
    seoDescription: { type: String },
    categoryDiscount: { type: Number, default: 0 }, // Added
  },
  { timestamps: true }
);

const BookSchema: Schema = new Schema(
  {
    bookName: { type: String, required: true },
    categoryName: { type: String, required: true },
    subCategory: { type: String },
    subSubCategory: { type: String },
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
  },
  { timestamps: true }
);
const ClothingCategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true, enum: ["men", "women"] },
  dresses: [{ type: Schema.Types.ObjectId, ref: "Dress" }],
}, { timestamps: true, collection: "Category" });

export const BookModel = mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);
export const BookCategoryModel = mongoose.models.BookCategory || mongoose.model<IBookCategory>("BookCategory", BookCategorySchema);
export const ClothingCategoryModel = mongoose.models.Category || mongoose.model<IClothingCategory>("Category", ClothingCategorySchema);