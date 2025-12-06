import { Schema, model, models, Document, Types } from 'mongoose';
import { IUser } from './User';

export interface IQuote extends Document {
  text: string;
  authorName?: string;
  author: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const quoteSchema = new Schema<IQuote>(
  {
    text: { type: String, required: true, trim: true },
    authorName: { type: String, trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

quoteSchema.index({ createdAt: -1 });

const Quote = models.Quote || model<IQuote>('Quote', quoteSchema);
export default Quote;






