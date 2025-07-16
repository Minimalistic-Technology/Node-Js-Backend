import mongoose from 'mongoose';

const WorkoutProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
  progress: Number,
  isFavorite: Boolean
});

export default mongoose.model('WorkoutProgress', WorkoutProgressSchema);