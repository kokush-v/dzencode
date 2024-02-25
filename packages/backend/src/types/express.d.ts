import { IUserSessionSchema } from '../schemas/user.schema';

// express.d.ts
declare global {
  namespace Express {
    interface Request {
      user: IUserSessionSchema;
    }
  }
}

export {};
