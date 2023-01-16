import { prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

export class User {
  @prop()
  public _id: Schema.Types.ObjectId;

  @prop({ type: () => String })
  public username?: string;

  @prop({ type: () => String })
  public passwordHash?: string;
}
