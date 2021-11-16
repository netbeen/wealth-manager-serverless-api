import { prop } from '@typegoose/typegoose';
import { EntityModel } from '@midwayjs/typegoose';
import { Schema } from 'mongoose';

@EntityModel()
export class User {
  @prop()
  public _id: Schema.Types.ObjectId;

  @prop()
  public username: string;

  @prop()
  public passwordHash: string;
}
