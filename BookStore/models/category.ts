import { Schema, model, Document } from 'mongoose';

interface ICategory extends Document {
  name: string;
  type: "category" | "tag"; // Changed from 'category' to 'type' to match frontend
  seoTitle: string;
  seoDescription: string;
}

// No need for external API validation for type; use enum-like constraint
const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ["category", "tag"], // Restrict to "category" or "tag"
    default: "category" // Default value if not provided
  },
  seoTitle: { type: String, required: true },
  seoDescription: { type: String, required: true }
});

export const Category = model<ICategory>('BookssCategory', categorySchema);