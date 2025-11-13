import { Schema, model, models, HydratedDocument, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export type UserRole = 'user' | 'admin' | 'super-admin';
export type UserStatus = 'active' | 'inactive';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  institute?: string;
  themePreference?: ThemePreference;
  lastLoginAt?: Date | null;
  passwordChangedAt?: Date | null;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  markPasswordChanged(): void;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;
export type UserModel = Model<IUser, Record<string, never>, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'admin', 'super-admin'],
      default: 'user',
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true,
    },
    phone: { type: String },
    institute: { type: String },
    themePreference: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    lastLoginAt: { type: Date, default: null },
    passwordChangedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform(_doc, ret) {
    const { password, __v, ...safe } = ret;
    return safe;
  },
});

userSchema.pre('save', async function (this: UserDocument, next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    this.passwordChangedAt = new Date();
    next();
  } catch (err) {
    next(err as Error);
  }
});

userSchema.methods.comparePassword = async function (
  this: UserDocument,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.markPasswordChanged = function (this: UserDocument): void {
  this.passwordChangedAt = new Date();
};

// 🛑 This avoids OverwriteModelError in dev mode
const User = models.User || model<IUser, UserModel>('User', userSchema);
export default User;
