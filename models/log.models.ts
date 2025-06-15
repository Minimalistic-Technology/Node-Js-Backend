import mongoose, { Schema, Document } from 'mongoose';

const apiLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  method: { type: String, required: true },
  endpoint: { type: String, required: true },
  requestPayload: { type: Object, default: {} },
  responsePayload: { type: Object, default: null },
  statusCode: { type: Number },
  duration: { type: Number },
  timestamp: { type: Date, default: Date.now },
  userAgent: { type: String },
  ip: { type: String },
});

const LogModel = mongoose.model<any>('Log', apiLogSchema);

export default LogModel;



