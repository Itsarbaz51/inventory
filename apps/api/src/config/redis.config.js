import Redis from 'ioredis';
import { envConfig } from './index.js';

export const redis = new Redis({
  host: envConfig.REDIS_HOST,
  port: Number(envConfig.REDIS_PORT),

  maxRetriesPerRequest: null,

  enableReadyCheck: false,
});
