import { Job } from 'bull';
import bcrypt from 'bcrypt';

import UserService from '../services/user.service';
import QUEUE from './list';
import db from '../config/database.config';
import { IUserRegistrationSchema, IUserSchema } from '../schemas/user.schema';
import { IPostCreateSchema, IPostSchema } from '../schemas/post.schema';
import { queue } from '../config/bull.config';
import { getRedisClient } from '../config/redis.config';

type InsertSchemas = IUserRegistrationSchema | IPostCreateSchema;
type CacheSchemas = IUserSchema | IPostSchema;

queue.process(QUEUE.CREATE, async (job: Job<{ data: InsertSchemas; index: string }>, done) => {
  try {
    const { data, index } = job.data;
    const response = await db.index({
      index,
      document: data
    });

    done(null, response);
  } catch (err) {
    if (err instanceof Error) done(err, null);
  }
});

queue.process(QUEUE.FIND_USER, async (job: Job<{ email: string }>, done) => {
  try {
    const { email } = job.data;
    const user = await new UserService().findOne(email);
    done(null, user);
  } catch (err) {
    if (err instanceof Error) done(err, null);
  }
});

queue.process(
  QUEUE.COMPARE_PASSWORDS,
  async (job: Job<{ password: string; userPassword: string }>, done) => {
    const { password, userPassword } = job.data;
    const validate = await bcrypt.compare(password, userPassword);
    done(null, validate);
  }
);

queue.process(QUEUE.PASSWORD_HASH, async (job: Job<{ password: string }>, done) => {
  const { password } = job.data;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  done(null, hashedPassword);
});

queue.process(QUEUE.CACHE_DATA, async (job: Job<CacheSchemas>, done) => {
  try {
    const redisClient = await getRedisClient();

    const { data } = job;
    if ('email' in data) {
      await redisClient.set(data.email, JSON.stringify(data));
    } else {
      await redisClient.set(data.id, JSON.stringify(data));
    }
    console.log('obj cashed');
    done(null, data);
  } catch (err) {
    console.error(err);
    if (err instanceof Error) done(err, null);
  }
});
