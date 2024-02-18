/* eslint-disable @typescript-eslint/no-empty-interface */

import { TypeOf, string, z } from 'zod';

export const UserSchema = z.object({
  id: string(),
  email: string(),
  name: string(),
  password: string()
});

export const UserLoginSchema = UserSchema.omit({ id: true, name: true });
export const UserRegistrationSchema = UserSchema.omit({ id: true });
export const UserSessionSchema = UserSchema.omit({ password: true });

export interface IUserSchema extends TypeOf<typeof UserSchema> {}
export interface IUserLoginSchema extends TypeOf<typeof UserLoginSchema> {}
export interface IUserRegistrationSchema extends TypeOf<typeof UserRegistrationSchema> {}
export interface IUserSessionSchema extends TypeOf<typeof UserSessionSchema> {}
