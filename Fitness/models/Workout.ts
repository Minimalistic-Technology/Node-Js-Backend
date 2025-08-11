import mongoose from 'mongoose';

const WorkoutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: Number,
  image: String,
  video: String
});

export default mongoose.model('Workout', WorkoutSchema);
