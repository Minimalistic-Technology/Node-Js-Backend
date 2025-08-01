import mongoose from 'mongoose';

const PracticeProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  description: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.model('PracticeProblem', PracticeProblemSchema);
