import { buildSchema } from 'graphql';
import jwt from 'jsonwebtoken';

import { IUserSessionSchema } from '../schemas/user.schema';
import { IPostCreateSchema, PostCreateShema } from '../schemas/post.schema';
import PostService from '../services/post.service';
import { OrderValues, SortValues } from '../types/enums';

export const postSchema = buildSchema(`
  type Post {
    id: String
    userEmail: String
    userName: String
    text: String
    file: String
    createdAt: String
    parent: String
    replies: [Post]
  }

  type Total {
    value: Int!
    relation: String!
  }

  type PostsOutput {
    data: [Post]!
    total: Total!
  }

  input PostCreateInput {
    text: String!
    file: String
  }

  input PostReplyInput {
    text: String!
    file: String
  }
   
  type Query {
    getPosts(page: Int!, sort: String!, order: String!): PostsOutput!
  }

  type Mutation {
    createPost(input: PostCreateInput!, token: String!): Post!
    replyPost(input: PostReplyInput!, token: String!, parent: String!): Post!
  }

`);

const postService = new PostService();

export const postRoot = {
  createPost: async ({ input: { text }, token }: { input: IPostCreateSchema; token: string }) => {
    const { email, name } = jwt.decode(token) as IUserSessionSchema;

    const validPost = PostCreateShema.parse({
      userName: name,
      userEmail: email,
      text
    });

    const response = await postService.create(validPost);

    return response;
  },
  replyPost: async ({
    input: { text },
    token,
    parent
  }: {
    input: IPostCreateSchema;
    token: string;
    parent: string;
  }) => {
    const { email, name } = jwt.decode(token) as IUserSessionSchema;

    const validPost = PostCreateShema.parse({
      userName: name,
      userEmail: email,
      text,
      parent
    });

    const response = await postService.create(validPost);

    return response;
  },
  getPosts: async ({
    page = 1,
    sort = SortValues.DATE,
    order = OrderValues.ASC
  }: {
    page: number;
    sort: SortValues;
    order: OrderValues;
  }) => {
    const posts = postService.findMany(page, sort, order);

    return posts;
  }
};
