import mongoose from 'mongoose';

const WorkoutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: Number
});

export default mongoose.model('Workout', WorkoutSchema);