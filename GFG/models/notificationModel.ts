import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    user: { type: String }, 
    type: { type: String, enum: ['problem', 'language'], required: true },
    createdBy: { type: String, enum: ['user', 'admin'], required: true }
  },
  { timestamps: true }
);

export default mongoose.model('NotificationGFG', notificationSchema);

