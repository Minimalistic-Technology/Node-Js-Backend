import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  name: string;
  email: string;
  rating: number;
  review: string;
}

const reviewSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('BooksReview', reviewSchema);