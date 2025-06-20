import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'admin';
  createdAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], required: true, default: 'student' },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model<IUser>('User', userSchema);

// Seed dummy users
export const seedUsers = async (): Promise<void> => {
  try {
    const existingUsers = await User.find();
    if (existingUsers.length === 0) {
      const dummyUsers = [
        { username: 'student1', email: 'student1@example.com', password: '1234', role: 'student' },
        { username: 'faculty1', email: 'faculty1@example.com', password: 'abcd', role: 'faculty' },
        { username: 'admin1', email: 'admin1@example.com', password: 'admin123', role: 'admin' },
      ];

      for (const user of dummyUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.create({
          username: user.username,
          email: user.email,
          password: hashedPassword,
          role: user.role,
        });
      }
      console.log('Dummy users seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

export default User;