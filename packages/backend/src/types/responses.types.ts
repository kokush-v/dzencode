import { IUserSessionSchema } from '../schemas/user.schema';

export interface Status {
  message?: string;
}

export interface Pages {
  pages: number;
}

export interface GetUserResponse {
  data?: IUserSessionSchema;
}

export interface CreateUserResponse extends Status, GetUserResponse {}

export interface LoginUserResponse extends Status {
  data?: IUserSessionSchema;
  token: string;
}
