import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    password: { type: String, required: true }
}, {
    timestamps: { createdAt: true, updatedAt: true }
});
userSchema.index({ email: 1 }, { unique: true });
userSchema.set('toJSON', {
    transform(_doc, ret) {
        const { password, __v, ...safe } = ret;
        return safe;
    }
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
    catch (error) {
        next(error);
    }
});
userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
