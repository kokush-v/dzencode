import { IPostCreateSchema } from '../schemas/post.schema';
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

export interface CreatePostRequest extends Express.Request {
  body: IPostCreateSchema;
}

export interface GetPostRequest extends Express.Request {
  params: {
    postId: string;
  };
}

export interface GetPostsRequestQuery extends Express.Request {
  query: {
    page: number;
  };
}

export interface GetExistRequest extends GetUserRequest, GetPostRequest {
  route: {
    path: string;
  };
}
