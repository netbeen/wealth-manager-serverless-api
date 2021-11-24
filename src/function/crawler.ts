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
import { CacheManager } from '@midwayjs/cache';
import {
  getCacheFirstArrayResource,
  getCacheFirstObjectResource,
  response200,
} from '../utils/response';

@Provide()
export class CrawlerHTTPService {
  @Inject()
  ctx: Context;
  @Inject()
  cache: CacheManager; // 依赖注入CacheManager

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
    return await getCacheFirstObjectResource(
      this.cache,
      `fetchBasicInfo${identifier}`,
      fetchBasicInfoByIdentifier(identifier),
      3600
    );
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/basicInfoUnitPriceSplitDividend/batchQuery',
    method: 'get',
  })
  async batchFetchBasicInfoUnitPriceSplitDividend(@Query() identifiersString) {
    const identifiers = identifiersString.split(',');
    const { data, from } = await getCacheFirstArrayResource(
      this.cache,
      `batchFetchBasicInfoUnitPriceSplitDividend${identifiersString}`,
      Promise.all([
        ...identifiers.map(identifier =>
          fetchBasicInfoByIdentifier(identifier)
        ),
        ...identifiers.map(identifier =>
          fetchUnitPriceByIdentifier(identifier)
        ),
        ...identifiers.map(identifier => fetchSplitByIdentifier(identifier)),
        ...identifiers.map(identifier => fetchDividendByIdentifier(identifier)),
      ]),
      3600
    );
    const identifierCount = identifiers.length;
    return response200({
      basicInfos: data.slice(0, identifierCount),
      unitPrices: data.slice(identifierCount, identifierCount * 2),
      splits: data.slice(identifierCount * 2, identifierCount * 3),
      dividends: data.slice(identifierCount * 3, identifierCount * 4),
      from,
    });
  }
}
