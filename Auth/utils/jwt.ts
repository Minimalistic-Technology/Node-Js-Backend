import 'dotenv/config';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { Response } from 'express';
import { IUser, UserRole } from '../models/User';

const {
  JWT_ACCESS_SECRET = 'change-this-access-secret',
  JWT_REFRESH_SECRET = 'change-this-refresh-secret',
  ACCESS_TOKEN_EXPIRE = '15m',
  REFRESH_TOKEN_EXPIRE = '7d',
  NODE_ENV,
} = process.env;

export interface TokenPayload extends JwtPayload {
  sub: string;
  role: UserRole;
  tokenVersion?: number;
}

const isProd = NODE_ENV === 'production';

const parseExpiryToSeconds = (expiry: string): number => {
  const match = expiry.match(/^(\d+)([smhd])$/i);
  if (!match) {
    return 60 * 15; // default 15 minutes
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return value;
  }
};

const signToken = (payload: TokenPayload, secret: string, options: SignOptions) =>
  jwt.sign(payload, secret, options);

export const signAccessToken = (user: IUser): string => {
  const expiresIn = ACCESS_TOKEN_EXPIRE;
  return signToken(
    {
      sub: user.id,
      role: user.role,
    },
    JWT_ACCESS_SECRET,
    { expiresIn }
  );
};

export const signRefreshToken = (user: IUser): string => {
  const expiresIn = REFRESH_TOKEN_EXPIRE;
  return signToken(
    {
      sub: user.id,
      role: user.role,
      tokenVersion: 1,
    },
    JWT_REFRESH_SECRET,
    { expiresIn }
  );
};

export const verifyAccessToken = (token: string): TokenPayload =>
  jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;

export const verifyRefreshToken = (token: string): TokenPayload =>
  jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;

export const attachAuthCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  const accessMaxAge = parseExpiryToSeconds(ACCESS_TOKEN_EXPIRE) * 1000;
  const refreshMaxAge = parseExpiryToSeconds(REFRESH_TOKEN_EXPIRE) * 1000;

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: isProd ? 'strict' : 'lax',
    secure: isProd,
    maxAge: accessMaxAge,
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: isProd ? 'strict' : 'lax',
    secure: isProd,
    maxAge: refreshMaxAge,
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
};
