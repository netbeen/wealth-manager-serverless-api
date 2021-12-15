import { Inject, Provide, ServerlessTrigger, ServerlessTriggerType } from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { response200 } from '../utils/response';
import { EmailService } from '../service/email';

@Provide()
export class TestHTTPService {
  @Inject()
  ctx: Context;
  @Inject()
  emailService: EmailService;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/test/sendEmail',
    method: 'get',
  })
  async sendEmail() {
    const insertResult = await this.emailService.send('394062113@qq.com', 'test123', 'Hello YY');
    return response200(insertResult);
  }
}
