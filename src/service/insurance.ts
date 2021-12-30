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
      throw new Error(e);
    }
  }

  async getList(
    organization: string
  ): Promise<Array<Insurance>> {
    try {
      return await this.insuranceModel.find({
        organization,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * 通过ID获取保险记录
   * @param id
   * @param organization
   */
  async getById(
    id: string,
    organization: string,
  ): Promise<Insurance> {
    try {
      // @ts-ignore
      return await this.insuranceModel.findOne({ organization, _id: id, });
    } catch (e) {
      throw new Error(e);
    }
  }
}
