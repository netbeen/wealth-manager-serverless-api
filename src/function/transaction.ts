import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessTriggerType,
  Config,
  ALL,
  Body,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { Model } from 'mongoose';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { response401, response403 } from '../utils/response';
import { UserService } from '../service/user';
import { OrganizationService } from '../service/organization';
import { TransactionService } from '../service/transaction';
import { Organization } from '../entity/organization';

@Provide()
export class TransactionOrganizationHTTPService {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;
  @Inject()
  organizationService: OrganizationService;
  @Inject()
  transactionService: TransactionService;
  @InjectEntityModel(Organization)
  organizationModel: Model<Organization>;
  @Config(ALL)
  allConfig;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/transaction',
    method: 'post',
  })
  async getAvailableOrganizations(
    @Body() target,
    @Body() volume,
    @Body() commission,
    @Body() date,
    @Body() direction
  ) {
    const loginUser = await this.userService.getUserFromToken(
      this.ctx.req.headers['x-wm-token']
    );
    if (!loginUser) {
      return response401('');
    }
    const organizationData =
      await this.organizationService.getAndVerifyOrganizationFromToken(
        this.ctx.req.headers['x-wm-organization'],
        loginUser._id.toString()
      );
    if (
      !organizationData.permissions.includes('Admin') &&
      !organizationData.permissions.includes('Collaborator')
    ) {
      return response403('');
    }
    const transaction = this.transactionService.insertTransaction(
      target,
      volume,
      commission,
      date,
      direction,
      loginUser._id.toString(),
      organizationData.organization._id.toString()
    );
    return transaction;
  }
}
