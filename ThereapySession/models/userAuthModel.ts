import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    fullName: string;
    email: string;
    phoneNumber: string;
    dob: Date;
    location: string;
    gender: 'male' | 'female' | 'other' | 'Prefer Not to say';
    password: string;
}

const userSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    dob: { type: Date, required: true },
    location: { type: String, required: true },
    gender: { type: String, enum: ['male','female','other','Prefer Not to say'], required: true },
    password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IUser>('UserAuth', userSchema);
