import { prop } from '@typegoose/typegoose';
import { EntityModel } from '@midwayjs/typegoose';
import { Schema } from 'mongoose';

@EntityModel()
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
