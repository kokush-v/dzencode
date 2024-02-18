/* eslint-disable @typescript-eslint/no-empty-interface */

import { TypeOf, string, z, array } from 'zod';

export const PostSchema = z.object({
  id: string(),
  userEmail: string(),
  userName: string(),
  text: string(),
  homePageUrl: string().optional().nullable(),
  files: array(string()).optional().nullable()
});

export const PostCreateShema = PostSchema.omit({
  id: true
});

export interface IPostSchema extends TypeOf<typeof PostSchema> {}
export interface IPostCreateSchema extends TypeOf<typeof PostCreateShema> {}
