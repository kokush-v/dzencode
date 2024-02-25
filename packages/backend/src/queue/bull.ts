import Bull, { Job, Queue } from 'bull';
import bcrypt from 'bcrypt';

import QUEUES from './list';
import { IUserRegistrationSchema, IUserSchema } from '../schemas/user.schema';
import { IPostCreateSchema, IPostSchema } from '../schemas/post.schema';
import db from '../config/database.config';
import UserService from '../services/user.service';
import { exTime, redisClient } from '../cache/redis';
import PostService from '../services/post.service';

type InsertSchemas = IUserRegistrationSchema | IPostCreateSchema;
type CacheSchemas = IUserSchema | IPostSchema | IPostSchema[];

export class QueueService {
  private defaultQueue: Queue;

  private static instance: QueueService;

  private static QUEUE_OPTIONS = {
    defaultJobOptions: {
      removeOnComplete: true, // this indicates if the job should be removed from the queue once it's complete
      removeOnFail: true // this indicates if the job should be removed from the queue if it fails
    },
    connection: {
      host: '127.0.0.1',
      port: process.env.BULL_PORT
    }
  };

  constructor() {
    if (QueueService.instance instanceof QueueService) {
      return QueueService.instance;
    }

    QueueService.instance = this;
  }

  async initService() {
    this.defaultQueue = await new Bull('bull-queue', QueueService.QUEUE_OPTIONS).isReady();

    queueService.getQueue().on('failed', (job, err) => {
      throw new Error(`Job ${job.id} failed with error ${err.message}`);
    });

    console.log(`Bull connect status: ${this.defaultQueue.client.status}`);
    await this.initProcceses();
  }

  async initProcceses() {
    this.defaultQueue.process(
      QUEUES.CREATE,
      async (job: Job<{ data: InsertSchemas; index: string }>, done) => {
        const { data, index } = job.data;
        db.index({
          index,
          document: data
        })
          .then((response) => done(null, response))
          .catch((err) => done(err, null));
      }
    );

    this.defaultQueue.process(QUEUES.FIND_USER, async (job: Job<{ email: string }>, done) => {
      const { email } = job.data;
      new UserService()
        .findOne(email)
        .then((user) => {
          done(null, user);
        })
        .catch((err) => {
          done(err, null);
        });
    });

    this.defaultQueue.process(QUEUES.POSTS, async (job: Job<{ page: number }>, done) => {
      const { page } = job.data;
      new PostService()
        .findMany(page)
        .then((posts) => {
          done(null, posts);
        })
        .catch((err) => {
          done(err, null);
        });
    });

    this.defaultQueue.process(
      QUEUES.COMPARE_PASSWORDS,
      async (job: Job<{ password: string; userPassword: string }>, done) => {
        const { password, userPassword } = job.data;
        bcrypt
          .compare(password, userPassword)
          .then((valid) => done(null, valid))
          .catch((err) => done(err, null));
      }
    );

    this.defaultQueue.process(
      QUEUES.PASSWORD_HASH,
      async (job: Job<{ password: string }>, done) => {
        const { password } = job.data;
        const saltRounds = 10;
        bcrypt
          .hash(password, saltRounds)
          .then((hashedPassword) => done(null, hashedPassword))
          .catch((err) => done(err, null));
      }
    );

    this.defaultQueue.process(
      QUEUES.CACHE_DATA,
      async (job: Job<{ key: string; data: CacheSchemas }>, done) => {
        try {
          const { data, key } = job.data;
          redisClient().setEx(key, exTime(), JSON.stringify(data));
          done(null, data);
        } catch (err) {
          console.error(err);
          if (err instanceof Error) done(err, null);
        }
      }
    );
  }

  getQueue() {
    return this.defaultQueue;
  }

  async addJob(id: QUEUES, variablesObj: any) {
    return await this.defaultQueue.add(id, variablesObj);
  }
}

export const queueService = new QueueService();
