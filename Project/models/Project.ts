import mongoose, { Document, Schema, model } from 'mongoose';

export interface IProject extends Document {
  image: string;
  name: string;
  git: string;
  live: string;
  category: 'Website Design' | 'App Mobile Design' | 'App Desktop' | 'Branding';
}

const projectSchema = new Schema<IProject>({
  image: { type: String, required: true },
  name: { type: String, required: true },
  git: { type: String, required: true },
  live: { type: String, required: true },
  category: {
    type: String,
    enum: ['Website Design', 'App Mobile Design', 'App Desktop', 'Branding'],
    required: true,
  },
});

export default model<IProject>('Project', projectSchema);
