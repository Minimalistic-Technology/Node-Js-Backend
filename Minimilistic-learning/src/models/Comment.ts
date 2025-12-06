import mongoose, { Schema, HydratedDocument, Model } from 'mongoose';

export interface IComment {
  postId: mongoose.Types.ObjectId;
  content: string;
  authorName?: string;
  authorEmail?: string;
  author?: mongoose.Types.ObjectId;
  approved: boolean;
}

export type CommentDocument = HydratedDocument<IComment>;
export type CommentModel = Model<IComment>;

const commentSchema = new Schema<IComment, CommentModel>(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    content: { type: String, required: true, trim: true },
    authorName: { type: String, trim: true },
    authorEmail: { type: String, trim: true, lowercase: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    approved: { type: Boolean, default: false, index: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

// Compound index for postId and approved status (for efficient filtering)
commentSchema.index({ postId: 1, approved: 1 });

// Index on createdAt for sorting
commentSchema.index({ createdAt: -1 });

// Index on author for efficient ownership queries
commentSchema.index({ author: 1 });

commentSchema.set('toJSON', {
  transform(_doc, ret) {
    const { __v, ...safe } = ret;
    return safe;
  }
});

const Comment = mongoose.models.Comment || mongoose.model<IComment, CommentModel>('Comment', commentSchema);
export default Comment;

