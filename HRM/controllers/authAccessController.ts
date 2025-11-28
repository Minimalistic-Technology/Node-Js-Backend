// controllers/authController.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthUserModel } from '../models/AuthUser';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES_IN = '7d';

const createToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const sendTokenResponse = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// 👇 IMPORTANT: type as RequestHandler and don't return Response

export const register: RequestHandler = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'default',
      contact,
      address,
      photoURL,
    } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email and password are required' });
      return;
    }

    const existingUser = await AuthUserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await AuthUserModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      contact,
      address,
      photoURL,
    });

    const token = createToken(user._id.toString(), user.role);
    sendTokenResponse(res, token);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        address: user.address,
        dateOfJoin: user.dateOfJoin,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await AuthUserModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = createToken(user._id.toString(), user.role);
    sendTokenResponse(res, token);

    res.status(200).json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        address: user.address,
        dateOfJoin: user.dateOfJoin,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// export const getMe: RequestHandler = async (req: Request, res, next) => {
//   try {
//     const authReq = req as AuthRequest;

//     if (!authReq.user?.id) {
//       res.status(401).json({ message: 'Not authorized' });
//       return;
//     }

//     const user = await AuthUserModel.findById(authReq.user.id).select('-password');
//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }

//     res.status(200).json({ user });
//   } catch (error) {
//     console.error('GetMe error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
