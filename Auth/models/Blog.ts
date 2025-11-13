import { Schema, model, models, Document, Types } from 'mongoose';
import { IUser } from './User';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  author: Types.ObjectId | IUser;
  published: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    published: { type: Boolean, default: true },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 });

const Blog = models.Blog || model<IBlog>('Blog', blogSchema);
export default Blog;

