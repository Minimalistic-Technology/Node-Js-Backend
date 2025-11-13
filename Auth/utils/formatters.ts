import { UserDocument } from '../models/User';

export const formatUser = (user: UserDocument) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  status: user.status,
  themePreference: user.themePreference,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

