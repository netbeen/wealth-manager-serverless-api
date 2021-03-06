import { prop } from '@typegoose/typegoose';
import { EntityModel } from '@midwayjs/typegoose';
import { Schema } from 'mongoose';

@EntityModel()
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
