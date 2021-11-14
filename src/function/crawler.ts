import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessTriggerType,
  Query,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { fetchUnitPriceByIdentifier } from 'fund-tools';

@Provide()
export class CrawlerHTTPService {
  @Inject()
  ctx: Context;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/unitPrice',
    method: 'get',
  })
  async handleHTTPEvent(@Query() identifier) {
    const result = await fetchUnitPriceByIdentifier(identifier);
    return result;
  }
}
