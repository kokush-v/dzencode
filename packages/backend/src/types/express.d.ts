import { UserSessionSchema } from 'src/schemas/user.schema';

// express.d.ts
declare global {
  namespace Express {
    interface Request {
      user: UserSessionSchema;
    }
  }
}

export {};
