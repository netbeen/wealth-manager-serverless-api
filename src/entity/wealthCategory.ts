import { prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

export class WealthCategory {
  @prop()
  public _id: Schema.Types.ObjectId;

  @prop()
  public name: string;

  @prop()
  public type: 'assets' | 'debt';
}
