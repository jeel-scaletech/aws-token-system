import { ValidUser } from 'src/auth/types/valid-user.type';

declare global {
  namespace Express {
    interface Request {
      user: ValidUser;
    }
  }
}

export {};
