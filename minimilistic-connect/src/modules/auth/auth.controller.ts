import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

// Helper to get request metadata
const getReqMeta = (req: Request) => ({
  ip: req.ip,
  userAgent: req.get('User-Agent'),
});

export const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.signup(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  verifyEmail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      const message = await authService.verifyEmail(token);
      res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const meta = getReqMeta(req);
      const tokens = await authService.login(req.body, meta.ip, meta.userAgent);
      // NOTE: You can also set cookies here if needed
      res.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  },

  oauthCallback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { provider, code } = req.body;
      const meta = getReqMeta(req);
      const tokens = await authService.oauthCallback(
        provider,
        code,
        meta.ip,
        meta.userAgent
      );
      res.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  },

  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const meta = getReqMeta(req);
      const tokens = await authService.refresh(
        refreshToken,
        meta.ip,
        meta.userAgent
      );
      res.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const meta = getReqMeta(req);
      await authService.logout(refreshToken, meta.ip, meta.userAgent);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};