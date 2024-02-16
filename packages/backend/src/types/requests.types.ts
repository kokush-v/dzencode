import { UserLoginSchema, UserRegistrationSchema, UserSchema } from '../schemas/user.schema';

export interface CreateUserRequest extends Express.Request {
  body: UserRegistrationSchema;
}

export interface GetUserRequest extends Express.Request {
  body: UserSchema;
}

export interface LoginUserRequest extends Express.Request {
  body: UserLoginSchema;
}

export interface GetExistRequest extends GetUserRequest {
  route: {
    path: string;
  };
}
