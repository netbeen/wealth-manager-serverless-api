import { Inject, Provide, ServerlessTrigger, ServerlessTriggerType } from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { response200, response500 } from '../utils/response';
import { EmailService } from '../service/email';
import { UserService } from '../service/user';
import { OrganizationPermission } from '../service/organization';

@Provide()
export class InsuranceHTTPService {
  @Inject()
  ctx: Context;
  @Inject()
  emailService: EmailService;
  @Inject()
  userService: UserService;

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
}
