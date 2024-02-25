import { buildSchema } from 'graphql';
import jwt from 'jsonwebtoken';

import {
  IUserLoginSchema,
  IUserRegistrationSchema,
  IUserSessionSchema,
  UserRegistrationSchema
} from '../schemas/user.schema';
import UserService from '../services/user.service';
import { queueService } from '../queue/bull';
import QUEUES from '../queue/list';

export const userSchema = buildSchema(`
    type User {
        id: ID! 
        email: String!
        name: String!
        password: String!
    }
    
    type UserLogin {
       user: User!
       token: String!
    }

    input UserLoginInput {
        email: String!
        password: String!
    }
    
    input UserRegistrationInput {
        email: String!
        name: String!
        password: String!
    }
    
    type Query {
        getUser(token: String!): User!
    }
    
    type Mutation {
        loginUser(input: UserLoginInput!): UserLogin!
        registerUser(input: UserRegistrationInput!): User!
    }
    
`);

const userService = new UserService();

export const userRoot = {
  registerUser: async ({ input }: { input: IUserRegistrationSchema }) => {
    const hashJob = await queueService.addJob(QUEUES.PASSWORD_HASH, { password: input.password });
    const hashedPassword: string = await hashJob.finished();

    const newUser = UserRegistrationSchema.parse({
      email: input.email,
      name: input.name,
      password: hashedPassword
    });

    const response = await userService.create(newUser);

    return response;
  },
  loginUser: async ({ input: { email, password } }: { input: IUserLoginSchema }) => {
    const user = await userService.findOne(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const comparePasswordsJob = await queueService.addJob(QUEUES.COMPARE_PASSWORDS, {
      password,
      userPassword: user.password
    });
    const validate: boolean = await comparePasswordsJob.finished();

    if (!validate) {
      throw new Error('Wrong Password');
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, id: user.id },
      process.env.JWT_SECRET
    );

    return { user, token };
  },
  getUser: async ({ token }: { token: string }) => {
    const { email } = jwt.decode(token) as IUserSessionSchema;

    if (!email) {
      throw new Error('Invalid token');
    }

    const user = await userService.findOne(email);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
};
