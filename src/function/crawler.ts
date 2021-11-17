import {
  Inject,
  Provide,
  Query,
  ServerlessTrigger,
  ServerlessTriggerType,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import {
  fetchSplitByIdentifier,
  fetchUnitPriceByIdentifier,
  fetchDividendByIdentifier,
  fetchBasicInfoByIdentifier,
} from 'fund-tools';

@Provide()
export class CrawlerHTTPService {
  @Inject()
  ctx: Context;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/unitPrice',
    method: 'get',
  })
  async fetchUnitPrice(@Query() identifier) {
    return await fetchUnitPriceByIdentifier(identifier);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/split',
    method: 'get',
  })
  async fetchSplit(@Query() identifier) {
    return await fetchSplitByIdentifier(identifier);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/dividend',
    method: 'get',
  })
  async fetchDividend(@Query() identifier) {
    return await fetchDividendByIdentifier(identifier);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/basicInfo',
    method: 'get',
  })
  async fetchBasicInfo(@Query() identifier) {
    return await fetchBasicInfoByIdentifier(identifier);
  }
}
