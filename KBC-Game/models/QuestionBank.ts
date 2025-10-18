import mongoose, { Schema, Document } from "mongoose";

export interface IQuestionBank extends Document {
  name: string;
  slug: string;
  description?: string;
  categories: string[];
  defaultTimer: number;
  bankImage?: string; 
  safePoint?: boolean;
  position: number;
  label: string;
  enabled: boolean;
  published: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionBankSchema = new Schema<IQuestionBank>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    categories: [String],
    defaultTimer: { type: Number, default: 30 },
    bankImage: { type: String },
    safePoint: { type: Boolean, default: false },
    position: { type: Number, unique: true },
    label: { type: String },
    enabled: { type: Boolean, default: true },
    published: { type: Boolean, default: false },
    createdBy: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IQuestionBank>("QuestionBank", QuestionBankSchema);
