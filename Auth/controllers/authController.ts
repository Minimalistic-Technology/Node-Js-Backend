import { Request, Response } from 'express';
import User from '../models/User';
import AuditLog from '../models/AuditLog';
import sendMail from '../utils/sendMail';
import {
  attachAuthCookies,
  clearAuthCookies,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import ErrorHandler from '../utils/ErrorHandler';
import { formatUser } from '../utils/formatters';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, phone, institute } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: 'Username, email, and password are required' });
    return;
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username: username.trim() }, { email: email.trim().toLowerCase() }],
    });

    if (existingUser) {
      res.status(409).json({ error: 'Username or email already registered' });
      return;
    }

    const user = new User({
      username,
      email,
      password,
      phone,
      institute,
    });

    await user.save();

    if (user.email) {
      sendMail({
        email: user.email,
        subject: 'Welcome to the Admin Dashboard',
        template: 'welcome.ejs',
        data: { username: user.username },
      }).catch((err) => {
        console.error('Error sending welcome email:', err);
      });
    }

    res.status(201).json({
      message: 'User created successfully',
      user: formatUser(user),
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      res.status(404).json({ error: 'Invalid credentials' });
      return;
    }

    if (user.status === 'inactive') {
      res.status(403).json({ error: 'Account is inactive. Contact support.' });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    attachAuthCookies(res, accessToken, refreshToken);

    await AuditLog.create({
      actor: user._id,
      action: 'login',
      entity: 'auth',
      metadata: { email: user.email },
    });

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: formatUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const tokenFromCookie = req.cookies?.refresh_token;
  const token = tokenFromCookie || req.body?.refreshToken;

  if (!token) {
    res.status(401).json({ error: 'Refresh token missing' });
    return;
  }

  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const accessToken = signAccessToken(user);
    const refreshTokenValue = signRefreshToken(user);
    attachAuthCookies(res, accessToken, refreshTokenValue);

    res.status(200).json({
      accessToken,
      refreshToken: refreshTokenValue,
      user: formatUser(user),
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

export const logout = (_req: Request, res: Response): void => {
  clearAuthCookies(res);
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getCurrentUser = (req: Request, res: Response): void => {
  if (!req.currentUser) {
    throw new ErrorHandler('User not found', 404);
  }

  res.status(200).json({ user: formatUser(req.currentUser) });
};
