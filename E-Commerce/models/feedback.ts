import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  userId: string;
  comment: string;
  rating: number;
}

const feedbackSchema = new Schema<IFeedback>({
  userId: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true }
}, { timestamps: true });

export const FeedbackModel = mongoose.model<IFeedback>('Feedback', feedbackSchema);
