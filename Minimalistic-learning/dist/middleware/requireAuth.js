import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../utils/jwt';
import * as userService from '../services/userService';
export const requireAuth = async (req, res, next) => {
    try {
        const bearer = req.headers.authorization;
        const tokenFromCookie = req.cookies?.access_token;
        const token = tokenFromCookie ||
            (bearer && bearer.startsWith('Bearer ') ? bearer.substring('Bearer '.length) : undefined);
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication required' });
        }
        const payload = verifyAccessToken(token);
        const user = await userService.findById(payload.sub);
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication required' });
        }
        req.user = user;
        next();
    }
    catch {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication required' });
    }
};
export default requireAuth;
