import { prop } from '@typegoose/typegoose';
import { EntityModel } from '@midwayjs/typegoose';
import { Schema } from 'mongoose';

@EntityModel()
export class WealthCategory {
  @prop()
  public _id: Schema.Types.ObjectId;

  @prop()
  public name: string;

  @prop()
  public type: 'assets' | 'debt';
}
