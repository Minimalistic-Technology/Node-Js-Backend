import mongoose, { Document, Schema } from "mongoose";

export interface IStudentGrade extends Document {
  examTitle: string;
  subject: string;
  examDate: string;
  duration: number;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  passingMarks: number;
  status: "pass" | "fail";
  grade: string;
  rank?: number;
  totalStudents?: number;
  feedback?: string;
  resultsPublished: boolean;
  publishedDate?: string;
}

const StudentGradeSchema = new Schema<IStudentGrade>({
  examTitle: { type: String, required: true },
  subject: { type: String, required: true },
  examDate: { type: String, required: true },
  duration: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  status: { type: String, enum: ["pass", "fail"], required: true },
  grade: { type: String, required: true },
  rank: { type: Number },
  totalStudents: { type: Number },
  feedback: { type: String },
  resultsPublished: { type: Boolean, default: false },
  publishedDate: { type: String }
}, { timestamps: true });

export const StudentGradeModel = mongoose.models.StudentGrade || mongoose.model<IStudentGrade>("StudentGrade", StudentGradeSchema);
