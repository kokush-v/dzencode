import Bull, { Job, Queue } from 'bull';
import QUEUES from './list';
import bcrypt from 'bcrypt';
import { IUserRegistrationSchema, IUserSchema } from '../schemas/user.schema';
import { IPostCreateSchema, IPostSchema } from '../schemas/post.schema';
import db from '../config/database.config';
import UserService from '../services/user.service';
import { exTime, redisClient } from '../cache/redis';

type InsertSchemas = IUserRegistrationSchema | IPostCreateSchema;
type CacheSchemas = IUserSchema | IPostSchema;

export class QueueService {
  private queues: Record<string, Queue>;
  private defaultQueue: Queue;

  private static instance: QueueService;

  private static QUEUE_OPTIONS = {
    defaultJobOptions: {
      removeOnComplete: false, // this indicates if the job should be removed from the queue once it's complete
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

    this.queues = {};
    QueueService.instance = this;
  }

  async initService() {
    this.defaultQueue = await new Bull('bull-queue', QueueService.QUEUE_OPTIONS).isReady();
    console.log(`Bull connect status: ${this.defaultQueue.client.status}`);
    await this.initProcceses();
  }

  async initProcceses() {
    this.defaultQueue.process(
      QUEUES.CREATE,
      async (job: Job<{ data: InsertSchemas; index: string }>, done) => {
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
      }
    );

    this.defaultQueue.process(QUEUES.FIND_USER, async (job: Job<{ email: string }>, done) => {
      try {
        const { email } = job.data;
        const user = await new UserService().findOne(email);
        done(null, user);
      } catch (err) {
        if (err instanceof Error) done(err, null);
      }
    });

    this.defaultQueue.process(
      QUEUES.COMPARE_PASSWORDS,
      async (job: Job<{ password: string; userPassword: string }>, done) => {
        const { password, userPassword } = job.data;
        const validate = await bcrypt.compare(password, userPassword);
        done(null, validate);
      }
    );

    this.defaultQueue.process(
      QUEUES.PASSWORD_HASH,
      async (job: Job<{ password: string }>, done) => {
        const { password } = job.data;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        done(null, hashedPassword);
      }
    );

    this.defaultQueue.process(QUEUES.CACHE_DATA, async (job: Job<CacheSchemas>, done) => {
      try {
        const { data } = job;
        if ('email' in data) {
          redisClient().setEx(data.email, exTime(), JSON.stringify(data));
        } else {
          redisClient().setEx(data.id, exTime(), JSON.stringify(data));
        }
        done(null, data);
      } catch (err) {
        console.error(err);
        if (err instanceof Error) done(err, null);
      }
    });
  }

  getQueue(name: QUEUES) {
    return this.queues[name];
  }

  async addJob(id: QUEUES, variablesObj: any) {
    return await this.defaultQueue.add(id, variablesObj);
  }
}

export const queueService = new QueueService();
