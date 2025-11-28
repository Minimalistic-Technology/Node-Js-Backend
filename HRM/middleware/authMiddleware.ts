// middleware/authMiddleware.ts
import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthRequest } from '../controllers/authAccessController';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

export const isUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token; // cookie name: token

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: '', // optional, if you want you can add email to token as well
      name: '',
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
