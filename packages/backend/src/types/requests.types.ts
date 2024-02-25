import { IPostCreateSchema } from '../schemas/post.schema';
import { IUserLoginSchema, IUserRegistrationSchema, IUserSchema } from '../schemas/user.schema';
import { OrderValues, SortValues } from './enums';

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

export interface ReplyPostRequest extends CreatePostRequest, GetPostRequest {}

export interface GetPostsRequestQuery extends Express.Request {
  query: {
    page: number;
    sort: SortValues;
    order: OrderValues;
  };
}

export interface GetExistRequest extends GetUserRequest, GetPostRequest {
  route: {
    path: string;
  };
}
