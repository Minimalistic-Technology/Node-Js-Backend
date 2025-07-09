import mongoose, { Schema, Document } from "mongoose";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
  type: 'multiple-choice' | 'true-false';
}

export interface IExam extends Document {
  title: string;
  subject: string;
  duration: number;
  totalQuestions: number;
  passingMarks: number;
  instructions: string[];
  questions: Question[];
  startTime?: Date;
  endTime?: Date;
  status: 'upcoming' | 'active' | 'completed' | 'missed' | 'waiting';
  scheduledDate: string;
  scheduledTime: string;
  adminControlled: boolean;
  resultsVisible: boolean;
  autoShowResults: boolean;
}

const QuestionSchema = new Schema<Question>({
  id: { type: Number, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  selectedAnswer: { type: Number },
  type: { type: String, enum: ['multiple-choice', 'true-false'], required: true }
});

const ExamSchema = new Schema<IExam>({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  duration: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  instructions: { type: [String], required: true },
  questions: { type: [QuestionSchema], required: true },
  startTime: { type: Date },
  endTime: { type: Date },
  status: { type: String, enum: ['upcoming', 'active', 'completed', 'missed', 'waiting'], required: true },
  scheduledDate: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  adminControlled: { type: Boolean, required: true },
  resultsVisible: { type: Boolean, required: true },
  autoShowResults: { type: Boolean, required: true }
}, { timestamps: true });

export const ExamModel = mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);
