import Redis from 'ioredis';
import { envConfig } from './index.js';

export const redis = new Redis(envConfig.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
