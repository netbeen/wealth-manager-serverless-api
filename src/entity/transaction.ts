import { prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

export class Transaction {
  @prop()
  public _id: Schema.Types.ObjectId;

  @prop()
  public commission: number;

  @prop()
  public date: string;

  @prop()
  public direction: string;

  @prop()
  public volume: number;

  @prop()
  public transactionSet: string;
}
