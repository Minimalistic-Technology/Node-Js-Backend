import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['User', 'Admin'], default: 'User' },
  problemSolved: { type: Number, default: 0 }
});

const GfgUser = mongoose.model('GfgUser', userSchema); 
export default GfgUser;
