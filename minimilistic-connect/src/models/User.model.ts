import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  passwordHash: {
    type: String,
    required: false,
  },
  passwordAlgo: {
    type: String,
    required: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  failedLoginCount: {
    type: Number,
    default: 0,
  },
  lockedUntil: {
    type: Date,
  },
  lastLoginAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  oauthProviders: {
    type: Object, // Or a more specific schema if needed
  },
});

// Update `updatedAt` on save
userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const User = model('User', userSchema);

export default User;

