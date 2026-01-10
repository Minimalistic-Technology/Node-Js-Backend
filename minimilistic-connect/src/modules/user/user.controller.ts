import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';

export const userController = {
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const user = await userService.getProfile(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
};


