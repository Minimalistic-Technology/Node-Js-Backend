import { Schema, model, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  description: string;
  category?: string;
  image?: string;
  date: string;
  author?: string;
  tags?: string[];
  rating: number;
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  image: { type: String },
  date: { type: String, required: true },
  author: { type: String },
  tags: [{ type: String }],
  rating: { type: Number, default: 0 }
});

export default model<IBlog>('Blog', blogSchema);
