import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
// @ts-ignore
import { Model, Types } from 'mongoose';
import { Transaction } from '../entity/transaction';
import { TransactionSet } from '../entity/transactionSet';
import { TransactionSetService } from './transactionSet';
import { CrawlerService } from './crawler';
import { WealthHistory } from '../entity/wealthHistory';
import { Dayjs } from 'dayjs';

@Provide()
export class WealthHistoryService {
  @InjectEntityModel(Transaction)
  transactionModel: Model<Transaction>;
  @InjectEntityModel(WealthHistory)
  wealthHistoryModel: Model<WealthHistory>;
  @InjectEntityModel(TransactionSet)
  transactionSetModel: Model<TransactionSet>;
  @Inject()
  transactionSetService: TransactionSetService;
  @Inject()
  crawlerService: CrawlerService;

  async insertHistory(date: Dayjs, detail: { [key: string]: number }, organization: string): Promise<WealthHistory> {
    if (!date || !detail || !organization) {
      throw new Error('Params Error');
    }
    return await this.wealthHistoryModel.create({
      _id: new Types.ObjectId(),
      date: date.format(),
      detail,
      organization,
    });
  }

  async getLatestHistoryRecord(organization: string): Promise<WealthHistory | null> {
    if (!organization) {
      throw new Error('Params Error');
    }
    // return null;
    const result = await this.wealthHistoryModel
      .findOne({
        organization,
      })
      .sort({ date: 'desc' });
    return result ?? null;
  }

  async getAllHistoryRecord(organization: string): Promise<Array<WealthHistory>> {
    if (!organization) {
      throw new Error('Params Error');
    }
    const result = await this.wealthHistoryModel
      .find({
        organization,
      })
      .sort({ date: 'desc' });
    return result ?? [];
  }
}
