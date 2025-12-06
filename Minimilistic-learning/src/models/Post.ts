import mongoose, { Schema, HydratedDocument, Model } from 'mongoose';

export interface IPost {
  title: string;
  slug: string;
  content: string;
  tags: string[];
  published: boolean;
  author?: mongoose.Types.ObjectId;
  publishedAt?: Date;
}

export type PostDocument = HydratedDocument<IPost>;
export type PostModel = Model<IPost>;

const postSchema = new Schema<IPost, PostModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [], index: true },
    published: { type: Boolean, default: false, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    publishedAt: { type: Date }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

// Text index for searching title and content
postSchema.index({ title: 'text', content: 'text' });

// Compound index for published status and tags (for efficient filtering)
postSchema.index({ published: 1, tags: 1 });

// Index on publishedAt for sorting
postSchema.index({ publishedAt: -1 });

// Unique index on slug for fast lookups
postSchema.index({ slug: 1 }, { unique: true });

// Compound index for slug and published status
postSchema.index({ slug: 1, published: 1 });

postSchema.set('toJSON', {
  transform(_doc, ret) {
    const { __v, ...safe } = ret;
    return safe;
  }
});

const Post = mongoose.models.Post || mongoose.model<IPost, PostModel>('Post', postSchema);
export default Post;

