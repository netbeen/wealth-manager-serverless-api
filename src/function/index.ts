import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessTriggerType,
  Query,
  Body,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';

@Provide()
export class IndexHTTPService {
  @Inject()
  ctx: Context;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/',
    method: 'get',
  })
  async handleHTTPEvent(@Query() name = 'midwayjs') {
    return `Hello ${name}`;
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/',
    method: 'post',
  })
  async handlePostHTTPEvent(@Body() name = 'midwayjs') {
    return `Hello ${name}`;
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/user/login2',
    method: 'post',
  })
  async handlePost2HTTPEvent(@Body() name = 'midwayjs') {
    return {};
  }
}
