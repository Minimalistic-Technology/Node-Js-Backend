import mongoose, { Schema, Document } from "mongoose";

interface PrizeLevel {
  level: number;
  amount: number;
  safeCheckpoint?: boolean;
}

export interface IQuestionBank extends Document {
  name: string;
  slug: string;
  description?: string;
  categories: string[];
  defaultTimer: number;
  prizeLadder: PrizeLevel[];
  position: number;
  label: string;
  enabled: boolean;
  published: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const PrizeLevelSchema = new Schema<PrizeLevel>({
  level: { type: Number, required: true },
  amount: { type: Number, required: true },
  safeCheckpoint: { type: Boolean, default: false },
});

const QuestionBankSchema = new Schema<IQuestionBank>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    categories: [String],
    defaultTimer: { type: Number, default: 30 },
    prizeLadder: { type: [PrizeLevelSchema], required: true },
    position: { type: Number, unique: true },
    label: { type: String },
    enabled: { type: Boolean, default: true },
    published: { type: Boolean, default: false },
    createdBy: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IQuestionBank>("QuestionBank", QuestionBankSchema);
