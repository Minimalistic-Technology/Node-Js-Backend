import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  studentId: string; // Reference to the student
  documentType: string; // e.g., "ID Card", "Aadhar", "Photo", "Results", "Other Proof"
  fileUrl: string; // URL or path to the uploaded file
  fileFormat: string; // e.g., "pdf", "jpg", "png"
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema(
  {
    studentId: { type: String, required: true }, // Could be a reference to a Student model if needed
    documentType: { 
      type: String, 
      required: true, 
      enum: ['ID Card', 'Photo', 'Aadhar', 'Results', 'Other Proof'] 
    },
    fileUrl: { type: String, required: true },
    fileFormat: { type: String, required: true, enum: ['pdf', 'jpg', 'png'] },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export default mongoose.model<IDocument>('Document', DocumentSchema);