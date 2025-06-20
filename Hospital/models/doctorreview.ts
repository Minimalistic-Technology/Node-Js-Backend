import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  doctor: string; // Name or ID of the selected doctor
  review: string;
  rating: number;
  privacyAgreed: boolean;
  createdAt: Date;
}

const DoctorReviewSchema: Schema = new Schema({
  doctor: { type: String, required: true }, // Store the selected doctor's name or ID
  review: { type: String, required: true, maxLength: 500 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  privacyAgreed: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReview>('DoctorReview', DoctorReviewSchema);