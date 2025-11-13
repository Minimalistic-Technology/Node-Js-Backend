import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CatchAsyncError } from './catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import User, { UserDocument, UserRole } from '../models/User';
import {
  attachAuthCookies,
  signAccessToken,
  signRefreshToken,
  TokenPayload,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/jwt';

declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: UserDocument;
    accessTokenPayload?: TokenPayload;
  }
}

const getAccessTokenFromRequest = (req: Request): string | undefined => {
  if (req.cookies?.access_token) {
    return req.cookies.access_token as string;
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return undefined;
};

const refreshTokensIfNeeded = async (
  req: Request,
  res: Response,
  expectedSub?: string
): Promise<TokenPayload> => {
  const refreshToken = req.cookies?.refresh_token;
  if (!refreshToken) {
    throw new ErrorHandler('Session expired. Please login again.', 401);
  }

  const refreshPayload = verifyRefreshToken(refreshToken);
  if (expectedSub && refreshPayload.sub !== expectedSub) {
    throw new ErrorHandler('Invalid session. Please login again.', 401);
  }

  const user = await User.findById(refreshPayload.sub);
  if (!user) {
    throw new ErrorHandler('User not found', 404);
  }

  const newAccessToken = signAccessToken(user);
  const newRefreshToken = signRefreshToken(user);
  attachAuthCookies(res, newAccessToken, newRefreshToken);

  return verifyAccessToken(newAccessToken);
};

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = getAccessTokenFromRequest(req);

    if (!token) {
      return next(new ErrorHandler('Please login to access this resource', 401));
    }

    let payload: TokenPayload;
    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        const decoded = jwt.decode(token) as TokenPayload | null;
        try {
          payload = await refreshTokensIfNeeded(
            req,
            res,
            decoded?.sub
          );
        } catch (refreshError) {
          return next(refreshError);
        }
      } else {
        return next(new ErrorHandler('Invalid token', 401));
      }
    }

    if (!payload?.sub) {
      return next(new ErrorHandler('Invalid token payload', 401));
    }

    const user = await User.findById(payload.sub);

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    if (user.status === 'inactive') {
      return next(new ErrorHandler('Account is inactive. Contact support.', 403));
    }

    req.currentUser = user;
    req.accessTokenPayload = payload;
    next();
  }
);

export const authorizeRoles = (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const user = req.currentUser;

    if (!user) {
      return next(new ErrorHandler('Unauthorized', 401));
    }

    if (!roles.includes(user.role)) {
      return next(
        new ErrorHandler(`Role ${user.role} is not allowed to access this resource`, 403)
      );
    }

    next();
  };

export const requireSuperAdmin = (req: Request, _res: Response, next: NextFunction) => {
  const user = req.currentUser;

  if (!user) {
    return next(new ErrorHandler('Unauthorized', 401));
  }

  if (user.role !== 'super-admin') {
    return next(new ErrorHandler('Only super admins can perform this action', 403));
  }

  next();
};
