import { IUserLoginSchema, IUserRegistrationSchema, IUserSchema } from '../schemas/user.schema';

export interface CreateUserRequest extends Express.Request {
  body: IUserRegistrationSchema;
}

export interface GetUserRequest extends Express.Request {
  body: IUserSchema;
}

export interface LoginUserRequest extends Express.Request {
  body: IUserLoginSchema;
}

export interface GetExistRequest extends GetUserRequest {
  route: {
    path: string;
  };
}
