import { UserSessionSchema } from '../schemas/user.schema';

export interface Status {
  message?: string;
}

export interface Pages {
  pages: number;
}

export interface GetUserResponse {
  data?: UserSessionSchema;
}

export interface CreateUserResponse extends Status, GetUserResponse {}

export interface LoginUserResponse extends Status {
  data?: UserSessionSchema;
  token: string;
}
