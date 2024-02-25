import { TypeOf, ZodType, string, z } from 'zod';

export const PostSchema: ZodType<Post> = z.object({
  id: string(),
  userEmail: string(),
  userName: string(),
  text: string(),
  file: string().optional().nullable(),
  createdAt: z.coerce.date().default(new Date()),
  parent: string().optional(),
  replies: z.array(z.lazy(() => PostSchema)).optional()
});

interface Post {
  id: string;
  userEmail: string;
  userName: string;
  text: string;
  file?: string | null;
  createdAt?: Date;
  parent?: string;
  replies?: Post[];
}

export const PostCreateShema = z.object({
  userEmail: string(),
  userName: string(),
  text: string(),
  file: string().optional().nullable(),
  createdAt: z.coerce.date().default(new Date()),
  parent: string().optional(),
  replies: z.array(z.lazy(() => PostSchema)).optional()
});

export const PostCreateShemaCaptcha = PostCreateShema.extend({
  reCaptcha: string()
});

export interface IPostSchema extends TypeOf<typeof PostSchema> {}
export interface IPostCreateSchema extends TypeOf<typeof PostCreateShema> {}
export interface IPostCreateSchemaToken extends TypeOf<typeof PostCreateShemaCaptcha> {}
