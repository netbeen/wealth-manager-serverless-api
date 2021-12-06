import { prop } from '@typegoose/typegoose';
import { EntityModel } from '@midwayjs/typegoose';
import { Schema } from 'mongoose';

@EntityModel()
export class WealthHistory {
  @prop()
  public _id: Schema.Types.ObjectId;

  @prop()
  public date: string;

  @prop()
  public detail: { [key: string]: number };

  @prop()
  public organization: string;
}
