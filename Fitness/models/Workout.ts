import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  sets: { type: Number, default: 0 }, 
  reps: { type: Number, default: 0 }      
});

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
  },
  exercises: [ExerciseSchema] 
});

export default mongoose.model('Workout', WorkoutSchema);
