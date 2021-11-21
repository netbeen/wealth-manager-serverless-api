import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { Model, Types } from 'mongoose';
import { TransactionSet } from '../entity/transactionSet';

@Provide()
export class TransactionSetService {
  @InjectEntityModel(TransactionSet)
  transactionSetModel: Model<TransactionSet>;

  async findOrInsertTransactionSet(
    target: string,
    organizationId: string
  ): Promise<TransactionSet> {
    let existedActiveTransactionSet = await this.transactionSetModel.findOne({
      status: 'active',
      target,
      organization: organizationId,
    });
    if (!existedActiveTransactionSet) {
      existedActiveTransactionSet = await this.transactionSetModel.create({
        _id: new Types.ObjectId(),
        status: 'active',
        target,
        organization: organizationId,
      });
    }
    return existedActiveTransactionSet;
  }

  async getActiveTransactionSets(
    target: string,
    organizationId: string
  ): Promise<Array<TransactionSet>> {
    return await this.transactionSetModel.find({
      status: 'active',
      target,
      organization: organizationId,
    });
  }
}
