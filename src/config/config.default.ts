export const customKey = 'hello';

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
