import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  studentId: string; 
  documentType: string; 
  fileUrl: string; 
  fileFormat: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema(
  {
    studentId: { type: String, required: true }, 
    documentType: { 
      type: String, 
      required: true, 
      enum: ['ID Card', 'Photo', 'Aadhar', 'Results', 'Other Proof'] 
    },
    fileUrl: { type: String, required: true },
    fileFormat: { type: String, required: true, enum: ['pdf', 'jpg', 'png'] },
  },
  { timestamps: true }  
);

export default mongoose.model<IDocument>('Document', DocumentSchema);