import { prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

export class TransactionSet {
  @prop()
  public _id: Schema.Types.ObjectId;

  @prop()
  public organization: string;

  @prop()
  public status: string;

  @prop()
  public target: string;
}
