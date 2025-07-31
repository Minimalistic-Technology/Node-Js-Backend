import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true }
});

const Language = mongoose.model('Language', languageSchema);
export default Language;
