import { createClient, RedisClientType } from 'redis';

export class RedisService {
  redisClient: RedisClientType;
  dataExTime = 60;

  async initRedis() {
    this.redisClient = (await createClient().connect()) as RedisClientType;

    this.redisClient.on('error', (error) => console.error(error));

    console.log('Redis connected');
  }
}

const redisService = new RedisService();

export const initRedis = redisService.initRedis.bind(redisService);
export const redisClient = () => redisService.redisClient;
export const exTime = () => redisService.dataExTime;
