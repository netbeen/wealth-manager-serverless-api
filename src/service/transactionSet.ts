import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { Model, Types } from 'mongoose';
import { TransactionSet } from '../entity/transactionSet';

export enum TransactionSetStatus {
  Active = 'active',
  Archived = 'archived',
}

@Provide()
export class TransactionSetService {
  @InjectEntityModel(TransactionSet)
  transactionSetModel: Model<TransactionSet>;

  async findOrInsertTransactionSet(target: string, organizationId: string): Promise<TransactionSet> {
    let existedActiveTransactionSet = await this.transactionSetModel.findOne({
      status: TransactionSetStatus.Active,
      target,
      organization: organizationId,
    });
    if (!existedActiveTransactionSet) {
      existedActiveTransactionSet = await this.transactionSetModel.create({
        _id: new Types.ObjectId(),
        status: TransactionSetStatus.Active,
        target,
        organization: organizationId,
      });
    }
    return existedActiveTransactionSet;
  }

  async getActiveTransactionSets(organizationId: string): Promise<Array<TransactionSet>> {
    return await this.transactionSetModel.find({
      status: TransactionSetStatus.Active,
      organization: organizationId,
    });
  }

  async getArchivedTransactionSets(organizationId: string): Promise<Array<TransactionSet>> {
    return await this.transactionSetModel.find({
      status: TransactionSetStatus.Archived,
      organization: organizationId,
    });
  }
}
