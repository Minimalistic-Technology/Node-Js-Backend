import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: { type: Number, required: true },
  explanation: { type: String, required: true },
});

const documentationSchema = new mongoose.Schema({
  language: { type: String, required: true },
  title: { type: String, required: true },
  theory: { type: String, required: true },
  code: { type: String, required: true },
  output: { type: String },
  quiz: {
    type: [quizSchema],
    validate: [(val: any[]) => val.length === 2, '{PATH} must have exactly 2 quiz items']
  }
}, { timestamps: true });

const Documentation = mongoose.model('Documentation', documentationSchema);
export default Documentation;
