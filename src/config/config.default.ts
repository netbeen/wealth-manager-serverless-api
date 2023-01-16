import { Insurance } from '../entity/insurance';
import { Organization } from '../entity/organization';
import { Transaction } from '../entity/transaction';
import { TransactionSet } from '../entity/transactionSet';
import { User } from '../entity/user';
import { WealthCategory } from '../entity/wealthCategory';
import { WealthHistory } from '../entity/wealthHistory';

export const mongoose = {
  dataSource: {
    default: {
      uri: 'mongodb+srv://cluster0.uu7ur.mongodb.net/wealth-manager-v4',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: 'wealth-manager-serverless-api',
        pass: process.env.MONGO_PASSWORD,
      },
      // 关联实体
      entities: [Insurance, Organization, Transaction, TransactionSet, User, WealthCategory, WealthHistory],
    },
  },
};
