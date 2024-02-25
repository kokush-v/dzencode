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

export interface UserSchema extends TypeOf<typeof UserSchema> {}
export interface UserLoginSchema extends TypeOf<typeof UserLoginSchema> {}
export interface UserRegistrationSchema extends TypeOf<typeof UserRegistrationSchema> {}
export interface UserSessionSchema extends TypeOf<typeof UserSessionSchema> {}
