import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import sendMail from '../../utils/sendMail';

interface JwtPayload {
  userID: string;
}

const generateAccessToken = (userID: string): string => {
  return jwt.sign({ userID }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

const generateRefreshToken = (userID: string): string => {
  return jwt.sign({ userID }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, phone, institute } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required" });
    return;
  }

  try {
    const userExists = await User.findOne({ $or: [{ username: name }, { email }] });
    if (userExists) {
      res.status(400).json({ error: 'Name or email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: name,
      email,
      password: hashedPassword,
      phone,
      institute
    });
    await newUser.save();

    if (email && typeof email === 'string' && email.trim() !== '') {
      try {
        await sendMail({
          email,
          subject: 'Welcome to Our App!',
          template: 'welcome.ejs',
          data: { username: name }
        });
      } catch (mailError) {
        console.error("Error sending welcome email:", mailError);
        // Email failure should not prevent signup
      }
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: 'Signup failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Incorrect password' });
      return;
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Login successful', accessToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refreshToken = (req: Request, res: Response): void => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    res.status(401).json({ error: 'Refresh token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
    const accessToken = generateAccessToken(decoded.userID);
    res.json({ accessToken });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};
