import mongoose, { Document, Schema } from 'mongoose';

export interface IExamSetting extends Document {
  examId: string;
  showResultImmediately: boolean;
  publishedByTeacher: boolean;
}

const examSettingSchema = new Schema<IExamSetting>({
  examId: { type: String, required: true, unique: true },
  showResultImmediately: { type: Boolean, required: true },
  publishedByTeacher: { type: Boolean, default: false },
}, { timestamps: true });

export const ExamSettingModel = mongoose.model<IExamSetting>('ExamSetting', examSettingSchema);
