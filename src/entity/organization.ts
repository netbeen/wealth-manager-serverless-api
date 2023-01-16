import { prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

export class Organization {
  @prop()
  public _id: Schema.Types.ObjectId;

  @prop()
  public adminList: Array<string>;

  @prop()
  public collaboratorList: Array<string>;

  @prop()
  public visitorList: Array<string>;

  @prop()
  public name: string;
}
