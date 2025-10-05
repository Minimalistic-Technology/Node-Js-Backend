
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthUserModel } from '../models/authUser';

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret';

interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(403).json({ message: 'Token missing' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);

    const user = await AuthUserModel.findById(decoded.id).lean();
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    req.user = user;  
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};


export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'Admin') {
    console.log(req.user)
    res.status(403).json({ message: 'Admin access required' });
    return; 
  }
  next();
};