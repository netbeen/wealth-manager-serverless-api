import { prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

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
