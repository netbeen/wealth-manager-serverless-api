import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessTriggerType,
  Query,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';

@Provide()
export class CrawlerHTTPService {
  @Inject()
  ctx: Context;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/unitPrice',
    method: 'get',
  })
  async handleHTTPEvent(@Query() identifier) {
    return `Hello ${identifier}`;
  }
}
