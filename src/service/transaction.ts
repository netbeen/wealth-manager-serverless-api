import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
// @ts-ignore
import { Model, Types } from 'mongoose';
import { calcReturn } from 'fund-tools';
import { Transaction } from '../entity/transaction';
import { TransactionSet } from '../entity/transactionSet';
import { TransactionSetService } from './transactionSet';
import { CrawlerService } from './crawler';
const almostEqual = require('almost-equal');
const dayjs = require('dayjs');

export enum TRANSACTION_DIRECTION {
  BUY = 'BUY',
  SELL = 'SELL',
}

@Provide()
export class TransactionService {
  @InjectEntityModel(Transaction)
  transactionModel: Model<Transaction>;
  @InjectEntityModel(TransactionSet)
  transactionSetModel: Model<TransactionSet>;
  @Inject()
  transactionSetService: TransactionSetService;
  @Inject()
  crawlerService: CrawlerService;

  /**
   * 判断当前交易后，该基金是否已经清仓，即这一阶段的投资旅程是否结束
   * @param transactionSet
   * @param sellVolume
   */
  async isZeroVolume(transactionSet: TransactionSet): Promise<boolean> {
    const transactions = await this.findTransaction(transactionSet._id.toString());
    const unitPrices = await this.crawlerService.fetchUnitPriceByIdentifier(transactionSet.target);
    const splits = await this.crawlerService.fetchSplitByIdentifier(transactionSet.target);
    const dividends = await this.crawlerService.fetchDividendByIdentifier(transactionSet.target);
    const { volume } = calcReturn(
      unitPrices,
      dividends,
      splits,
      transactions.map(transaction => ({
        date: dayjs(transaction.date),
        direction: transaction.direction === TRANSACTION_DIRECTION.BUY ? TRANSACTION_DIRECTION.BUY : TRANSACTION_DIRECTION.SELL,
        volume: transaction.volume,
        commission: transaction.commission,
      }))
    );
    // 规避 -0 的场景，解决浮点数运算精度问题
    return almostEqual(volume, 0, almostEqual.FLT_EPSILON, almostEqual.FLT_EPSILON);
  }

  async insertTransaction(
    target: string,
    volume: number,
    commission: number,
    date: string,
    direction: TRANSACTION_DIRECTION,
    userId: string,
    organizationId: string
  ): Promise<Transaction> {
    try {
      const existedActiveTransactionSet = await this.transactionSetService.findOrInsertTransactionSet(target, organizationId);
      const transaction = await this.transactionModel.create({
        _id: new Types.ObjectId(),
        transactionSet: existedActiveTransactionSet._id,
        commission,
        date,
        direction,
        volume,
      });
      if (direction === TRANSACTION_DIRECTION.SELL) {
        const isZeroVolume = await this.isZeroVolume(existedActiveTransactionSet);
        if (isZeroVolume) {
          await this.transactionSetService.archiveTransactionSet(existedActiveTransactionSet._id.toString());
        }
      }
      return transaction;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findTransaction(transactionSet: string | null): Promise<Array<Transaction>> {
    const query: { transactionSet?: string } = {};
    if (transactionSet) {
      query.transactionSet = transactionSet;
    }
    try {
      return await this.transactionModel.find(query);
    } catch (e) {
      throw new Error(e);
    }
  }
}
