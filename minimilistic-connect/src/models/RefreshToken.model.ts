import { Schema, model, Types } from 'mongoose';

const refreshTokenSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  tokenSignature: {
    type: String,
    required: true,
    unique: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  revoked: {
    type: Boolean,
    default: false,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  replacedById: {
    type: Types.ObjectId,
    unique: true,
    sparse: true, // Allows multiple null values
  },
});

const RefreshToken = model('RefreshToken', refreshTokenSchema);

export default RefreshToken;

