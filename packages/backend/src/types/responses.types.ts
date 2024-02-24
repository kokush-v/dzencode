import { IPostSchema } from '../schemas/post.schema';
import { IUserSessionSchema } from '../schemas/user.schema';

export interface Status {
  message?: string;
}

export interface Pages {
  pages: number;
}

export interface GetUserResponse extends Status {
  data: IUserSessionSchema;
}

export interface CreateUserResponse extends GetUserResponse {}

export interface LoginUserResponse extends Status {
  data: IUserSessionSchema;
  token: string;
}

export interface GetPostResponse extends Status {
  data: IPostSchema;
}

export interface GetPostsResponse extends Status {
  data: IPostSchema[];
  total?: number;
  pages?: number;
}

export interface CreatePostResponse extends GetPostResponse {}
