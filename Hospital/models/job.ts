import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  location: string;
}

const jobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  location: { type: String, required: true },
});

const Job = mongoose.model<IJob>('Job', jobSchema);

export default Job;
