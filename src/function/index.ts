import { Provide, Inject, ServerlessTrigger, ServerlessTriggerType, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';

@Provide()
export class IndexHTTPService {
  @Inject()
  ctx: Context;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/',
    method: 'get',
  })
  async handleHTTPEvent(@Query() { name = 'midwayjs' }) {
    return `Hello ${name}`;
  }
}
