import * as redisStore from 'cache-manager-ioredis';

export const mongoose = {
  client: {
    uri: 'mongodb+srv://cluster0.uu7ur.mongodb.net/wealth-manager-v4',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: 'wealth-manager-serverless-api',
      pass: process.env.MONGO_PASSWORD,
    },
  },
};

export const cache = {
  store: redisStore,
  options: {
    host: 'redis-11157.c295.ap-southeast-1-1.ec2.cloud.redislabs.com', // default value
    port: 11157, // default value
    password: process.env.REDIS_PASSWORD,
    db: 0,
    keyPrefix: 'wm4:',
  },
};
