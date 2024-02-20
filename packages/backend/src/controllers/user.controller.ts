import jwt from 'jsonwebtoken';
import { Response } from 'express';

import UserService from '../services/user.service';
import { CreateUserRequest, GetUserRequest, LoginUserRequest } from '../types/requests.types';
import { CreateUserResponse, GetUserResponse, LoginUserResponse } from '../types/responses.types';
import { ERRORS, MESSAGES } from '../constants';
import {
  IUserSchema,
  IUserSessionSchema,
  UserRegistrationSchema,
  UserSessionSchema
} from '../schemas/user.schema';
import QUEUE from '../queue/list';
import { localStrategy } from '../routes/middlewares/auth.middlewares';
import { queueService } from '../queue/bull';
import { redisClient } from '../cache/redis';

export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  async registerUser(req: CreateUserRequest, res: Response<CreateUserResponse>) {
    const { email, name, password } = req.body;

    const hashJob = await queueService.addJob(QUEUE.PASSWORD_HASH, { password });
    const hashedPassword: string = await hashJob.finished();

    const newUser = UserRegistrationSchema.parse({
      email,
      name,
      password: hashedPassword
    });

    const response = await this.userService.create(newUser);

    res.send({ data: response, message: MESSAGES.USER.CREATED });
  }

  async loginUser(req: LoginUserRequest, res: Response<LoginUserResponse | { error: string }>) {
    localStrategy(req, res, (err: Error) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const user = req.user as IUserSchema;

      if (!user) {
        return res.status(400).json({ error: ERRORS.USER.NOT_EXIST });
      }

      req.login(user, { session: false }, async (error) => {
        if (error) throw error;

        const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET);

        return res.json({ data: user, token, message: MESSAGES.USER.LOGINED });
      });
    });
  }

  async getUser(req: GetUserRequest, res: Response<GetUserResponse>) {
    const { email } = req.user as IUserSessionSchema;
    let user: IUserSessionSchema;
    const cache = null;
    await redisClient().get(email);

    if (cache) {
      user = UserSessionSchema.parse(JSON.parse(cache));
    } else {
      const findUserJob = await queueService.addJob(QUEUE.FIND_USER, { email });
      user = await findUserJob.finished();
      queueService.addJob(QUEUE.CACHE_DATA, user);
    }

    res.send({ data: user });
  }
}

const userController = new UserController();
export default userController;
