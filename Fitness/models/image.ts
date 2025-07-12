import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
  title: string;
  base64: string; 
}

const imageSchema = new Schema<IImage>({
  title: { type: String, required: true },
  base64: { type: String, required: true }, 
}, { timestamps: true });

export const ImageModel = mongoose.model<IImage>('Image', imageSchema);
