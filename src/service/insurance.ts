import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { Model, Types } from 'mongoose';
import { User } from '../entity/user';
import { Insurance } from '../entity/insurance';
import { OrganizationService } from './organization';

@Provide()
export class InsuranceService {
  @InjectEntityModel(User)
  userModel: Model<User>;
  @InjectEntityModel(Insurance)
  insuranceModel: Model<Insurance>;
  @Inject()
  organizationService: OrganizationService;

  async insert(
    type: string,
    name: string,
    insured: string,
    insuredAmount: string,
    firstPaymentDate: string,
    paymentPlan: string,
    contractUrl: string,
    organization: string
  ): Promise<Insurance> {
    try {
      return await this.insuranceModel.create({
        _id: new Types.ObjectId(),
        type,
        name,
        insured,
        insuredAmount,
        firstPaymentDate,
        paymentPlan,
        contractUrl,
        organization,
      });
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
}
