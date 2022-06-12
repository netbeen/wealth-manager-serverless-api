import { Inject, Body, Query, Provide, ServerlessTrigger, ServerlessTriggerType } from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { response200, response500 } from '../utils/response';
import { EmailService } from '../service/email';
import { UserService } from '../service/user';
import { InsuranceService } from '../service/insurance';
import { OrganizationPermission } from '../service/organization';

@Provide()
export class InsuranceHTTPService {
  @Inject()
  ctx: Context;
  @Inject()
  emailService: EmailService;
  @Inject()
  userService: UserService;
  @Inject()
  insuranceService: InsuranceService;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/insurance/sendTestEmail',
    method: 'post',
  })
  async sendTestEmail() {
    const { result, errorResponse, user } = await this.userService.checkLoginStatusAndOrganizationPermission(this.ctx.req.headers, OrganizationPermission.Collaborator);
    if (!result) {
      return errorResponse;
    }
    if (!/\w+@\w+/.test(user.username)) {
      return response500('UserName is not valid Email');
    }
    const insertResult = await this.emailService.send(user.username, '您有保险即将续保，请注意扣款卡余额', 'Hello YY');
    return response200(insertResult);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/insurance/insert',
    method: 'post',
  })
  async insert(@Body() type, @Body() name, @Body() insured, @Body() insuredAmount, @Body() firstPaymentDate, @Body() paymentPlan, @Body() contractUrl) {
    const { organization, result, errorResponse } = await this.userService.checkLoginStatusAndOrganizationPermission(this.ctx.req.headers, OrganizationPermission.Collaborator);
    if (!result) {
      return errorResponse;
    }
    const insertResult = await this.insuranceService.insert(type, name, insured, insuredAmount, firstPaymentDate, paymentPlan, contractUrl, organization._id.toString());
    return response200(insertResult);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/insurance/list',
    method: 'get',
  })
  async getList() {
    const { organization, result, errorResponse } = await this.userService.checkLoginStatusAndOrganizationPermission(this.ctx.req.headers, OrganizationPermission.Visitor);
    if (!result) {
      return errorResponse;
    }
    const insertResult = await this.insuranceService.getList(organization._id.toString());
    return response200(insertResult);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/insurance/getById',
    method: 'get',
  })
  async getById(@Query() id) {
    const { organization, result, errorResponse } = await this.userService.checkLoginStatusAndOrganizationPermission(this.ctx.req.headers, OrganizationPermission.Visitor);
    if (!result) {
      return errorResponse;
    }
    const insertResult = await this.insuranceService.getById(id, organization._id.toString());
    return response200(insertResult);
  }
}
