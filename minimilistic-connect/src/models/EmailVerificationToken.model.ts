import { Schema, model, Types } from 'mongoose';

const emailVerificationTokenSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  tokenHash: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  consumed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const EmailVerificationToken = model('EmailVerificationToken', emailVerificationTokenSchema);

export default EmailVerificationToken;

