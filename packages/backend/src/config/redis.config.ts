import { createClient } from 'redis';

export const getRedisClient = async () => {
  const client = createClient();
  client.on('error', (error) => console.error(error));
  await client.connect();
  return client;
};
