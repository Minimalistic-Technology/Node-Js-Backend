import { Schema, model, Document } from "mongoose";

export interface IQuoteBlog extends Document {
  quote: string;
  name: string;
  title: string;
  createdAt: Date;
}

const quoteBlogSchema = new Schema<IQuoteBlog>({
  quote: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuoteBlog = model<IQuoteBlog>("QuoteBlog", quoteBlogSchema);
export default QuoteBlog;
