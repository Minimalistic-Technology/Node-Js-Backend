import mongoose, { Document, Schema } from 'mongoose';

// Define the TypeScript interface
export interface JobDocument extends Document {
  title: string;
  location: string;
}

// Define the schema
const jobSchema = new Schema<JobDocument>({
  title: { type: String, required: true },
  location: { type: String, required: true },
});

// Export the model
export const Job = mongoose.model<JobDocument>('Job', jobSchema);
