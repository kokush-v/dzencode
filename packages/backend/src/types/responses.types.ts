import { IUser, IUserSession } from './user.type';

export interface Status {
  message?: string;
}

export interface Pages {
  pages: number;
}

export interface GetUserResponse {
  data?: IUserSession;
}

export interface CreateUserResponse extends Status, GetUserResponse {}

export interface LoginUserResponse extends Status {
  data?: IUser;
  token: string;
}
