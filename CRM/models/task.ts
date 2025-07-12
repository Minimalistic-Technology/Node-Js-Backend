import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  owner: string;
  subject: string;
  status: string;
  due: Date;
  priority: string;
}

const TaskSchema = new Schema<ITask>({
  owner: { type: String, required: true },
  subject: { type: String, required: true },
  status: { type: String, required: true },
  due: { type: Date, required: true },
  priority: { type: String, required: true },
}, { timestamps: true });

export const TaskModel = mongoose.model<ITask>('Task', TaskSchema);
