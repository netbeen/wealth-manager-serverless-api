import { Provide, Inject, ServerlessTrigger, ServerlessTriggerType } from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { response200 } from '../utils/response';

@Provide()
export class HealthCheckHTTPService {
  @Inject()
  ctx: Context;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/health-check',
    method: 'get',
  })
  async healthCheck() {
    return response200({
      message: 'Hello world!',
      timestamp: new Date().valueOf(),
    });
  }
}
