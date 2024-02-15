import { User } from '../entities/User.entity';
import { IUser } from './user.type';

export interface CreateUserRequest extends Express.Request {
  body: IUser;
}

export interface GetUserRequest extends Express.Request {
  body: User;
}

export interface LoginUserRequest extends CreateUserRequest {}

export interface GetExistRequest extends GetUserRequest {
  route: {
    path: string;
  };
}
