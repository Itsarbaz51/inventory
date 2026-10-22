import Redis from 'ioredis';
import { envConfig } from './index.js';

export const redis = new Redis(envConfig.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

redis.on('error', (error) => {
  console.error('Redis error:', error.message);
});
