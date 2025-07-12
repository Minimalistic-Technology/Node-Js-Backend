import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  password: {
    type: String,
    required: false, // Make password optional for bulk import
  },
}, { timestamps: true });

// Export the User model, reusing it if already defined
export const User = mongoose.models.User || mongoose.model('User', userSchema);