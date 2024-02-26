import { createClient, RedisClientType } from 'redis';

export class RedisService {
  redisClient: RedisClientType;
  dataExTime = 60;

  async initRedis() {
    this.redisClient = (await createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    }).connect()) as RedisClientType;

    this.redisClient.on('REDIS_SERVICE=======================', (error) => console.error(error));

    console.log('Redis connected');
  }
}

const redisService = new RedisService();

export const initRedis = redisService.initRedis.bind(redisService);
export const redisClient = () => redisService.redisClient;
export const exTime = () => redisService.dataExTime;
