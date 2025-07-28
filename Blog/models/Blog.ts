import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBlog extends Document {
  title: string;
  description: string;
  category?: string;
  image?: string;
  date: Date;
  author?: string;
  tags?: string[];
  rating: number;
  minutes: number;
  authorId: Types.ObjectId;
  verified: boolean;
  paraphrased?: string;
  views: number;
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  image: { type: String },
  date: { type: Date, required: true, default: Date.now },
  author: { type: String },
  tags: [{ type: String }],
  rating: { type: Number, default: 0, min: 0 },
  minutes: { type: Number, min: 1, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  verified: { type: Boolean, default: false },
  paraphrased: { type: String },
  views: { type: Number, default: 0, min: 0 },
});

const Blog = mongoose.model<IBlog>("Blog", blogSchema);
export default Blog;
