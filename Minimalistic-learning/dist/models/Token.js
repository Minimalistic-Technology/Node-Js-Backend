import mongoose, { Schema } from 'mongoose';
const tokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tokenHash: { type: String, required: true },
    type: { type: String, enum: ['refresh', 'reset'], required: true },
    expiresAt: { type: Date, required: true },
    metadata: { type: Schema.Types.Mixed }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
tokenSchema.index({ user: 1 });
tokenSchema.index({ type: 1 });
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema);
export default Token;
