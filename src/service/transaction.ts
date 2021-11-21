import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { Model, Types } from 'mongoose';
import { Transaction } from '../entity/transaction';
import { TransactionSet } from '../entity/transactionSet';
import { TransactionSetService } from './transactionSet';

@Provide()
export class TransactionService {
  @InjectEntityModel(Transaction)
  transactionModel: Model<Transaction>;
  @InjectEntityModel(TransactionSet)
  transactionSetModel: Model<TransactionSet>;
  @Inject()
  transactionSetService: TransactionSetService;

  async insertTransaction(
    target: string,
    volume: number,
    commission: number,
    date: string,
    direction: string,
    userId: string,
    organizationId: string
  ): Promise<Transaction> {
    try {
      const existedActiveTransactionSet =
        await this.transactionSetService.findOrInsertTransactionSet(
          target,
          organizationId
        );
      return await this.transactionModel.create({
        _id: new Types.ObjectId(),
        transactionSet: existedActiveTransactionSet._id,
        commission,
        date,
        direction,
        volume,
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
