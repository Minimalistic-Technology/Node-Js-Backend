import { UserDocument } from '../models/User';
import { TokenPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDocument;
      accessTokenPayload?: TokenPayload;
    }
  }
}

export {};

