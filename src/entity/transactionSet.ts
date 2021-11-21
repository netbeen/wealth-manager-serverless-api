import { prop } from '@typegoose/typegoose';
import { EntityModel } from '@midwayjs/typegoose';
import { Schema } from 'mongoose';

@EntityModel()
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
