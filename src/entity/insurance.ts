import { prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

export class Insurance {
  @prop()
  public _id: Schema.Types.ObjectId;

  @prop()
  public organization: string;

  @prop()
  public active: boolean;

  @prop()
  public type: string;

  @prop()
  public name: string;

  @prop()
  public insured: string;

  @prop()
  public insuredAmount: string;

  @prop()
  public firstPaymentDate: string;

  @prop()
  public paymentPlan: string;

  @prop()
  public contractUrl: string;
}
