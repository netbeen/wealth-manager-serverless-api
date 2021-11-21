import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { Model, Types } from 'mongoose';
import { Transaction } from '../entity/transaction';
import { TransactionSet } from '../entity/transactionSet';

@Provide()
export class TransactionService {
  @InjectEntityModel(Transaction)
  transactionModel: Model<Transaction>;
  @InjectEntityModel(TransactionSet)
  transactionSetModel: Model<TransactionSet>;

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
      let existedActiveTransactionSet = await this.transactionSetModel.findOne({
        status: 'active',
        target,
      });
      if (!existedActiveTransactionSet) {
        existedActiveTransactionSet = await this.transactionSetModel.create({
          _id: new Types.ObjectId(),
          status: 'active',
          target,
          organization: organizationId,
        });
      }
      const transaction = await this.transactionModel.create({
        _id: new Types.ObjectId(),
        transactionSet: existedActiveTransactionSet._id,
        commission,
        date,
        direction,
        volume,
      });
      return transaction;
    } catch (e) {
      throw new Error(e);
    }
  }
}
