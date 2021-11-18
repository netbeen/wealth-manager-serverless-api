import { prop } from '@typegoose/typegoose';
import { EntityModel } from '@midwayjs/typegoose';
import { Schema } from 'mongoose';

@EntityModel()
export class Organization {
  @prop()
  public _id: Schema.Types.ObjectId;

  @prop({ type: Schema.Types.Mixed })
  public adminList: Array<string>;

  @prop({ type: Schema.Types.Mixed })
  public collaboratorList: Array<string>;

  @prop({ type: Schema.Types.Mixed })
  public visitorList: Array<string>;

  @prop()
  public name: string;
}
