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

  async getTransactionSetById(id: string, organizationId: string): Promise<TransactionSet> {
    // @ts-ignore
    return await this.transactionSetModel.findOne({ _id: id, organization: organizationId });
  }

  async archiveTransactionSet(transactionSetId: string): Promise<void> {
    // @ts-ignore
    // eslint-disable-next-line prettier/prettier
    this.transactionSetModel.updateOne({ _id: transactionSetId }, {
          status: TransactionSetStatus.Archived,
        }
      )
      .exec();
  }

  async getTransactionSets(organizationId: string, status?: TransactionSetStatus): Promise<Array<TransactionSet>> {
    const query: { organization: string; status?: TransactionSetStatus } = {
      organization: organizationId,
    };
    if (status) {
      query.status = status;
    }
    return await this.transactionSetModel.find(query);
  }
}
