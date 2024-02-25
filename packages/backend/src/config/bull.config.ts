import Bull from 'bull';

export const queue = new Bull('bull-funcs', {
  redis: {
    host: 'localhost',
    port: process.env.BULL_PORT
  }
});
