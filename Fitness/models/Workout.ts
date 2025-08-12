import mongoose from 'mongoose';

const WorkoutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: Number,
  image: String,
  video: String,
  type: { 
    type: String, 
    enum: ['strength', 'cardio', 'hiit', 'yoga'],
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Workout', WorkoutSchema);
