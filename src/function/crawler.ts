import { Inject, Provide, Query, ServerlessTrigger, ServerlessTriggerType } from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { CacheManager } from '@midwayjs/cache';
import { response200, response400 } from '../utils/response';
import { CrawlerService } from '../service/crawler';

@Provide()
export class CrawlerHTTPService {
  @Inject()
  ctx: Context;
  @Inject()
  cache: CacheManager; // 依赖注入CacheManager
  @Inject()
  crawlerService: CrawlerService;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/unitPrice',
    method: 'get',
  })
  async fetchUnitPrice(@Query() identifier) {
    const result = await this.crawlerService.fetchUnitPriceByIdentifier(identifier);
    return response200(result);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/split',
    method: 'get',
  })
  async fetchSplit(@Query() identifier) {
    const result = await this.crawlerService.fetchSplitByIdentifier(identifier);
    return response200(result);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/dividend',
    method: 'get',
  })
  async fetchDividend(@Query() identifier) {
    const result = await this.crawlerService.fetchDividendByIdentifier(identifier);
    return response200(result);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/basicInfo',
    method: 'get',
  })
  async fetchBasicInfo(@Query() identifier) {
    const result = await this.crawlerService.fetchBasicInfoByIdentifier(identifier);
    return response200(result);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/basicInfoUnitPriceSplitDividend/batchQuery',
    method: 'get',
  })
  async batchFetchBasicInfoUnitPriceSplitDividend(@Query() identifiersString) {
    if (identifiersString.length === 0) {
      return response400('Params Error');
    }
    const identifiers = identifiersString.split(',');
    const data = await Promise.all([
      ...identifiers.map(identifier => this.crawlerService.fetchBasicInfoByIdentifier(identifier)),
      ...identifiers.map(identifier => this.crawlerService.fetchUnitPriceByIdentifier(identifier)),
      ...identifiers.map(identifier => this.crawlerService.fetchSplitByIdentifier(identifier)),
      ...identifiers.map(identifier => this.crawlerService.fetchDividendByIdentifier(identifier)),
    ]);
    const identifierCount = identifiers.length;
    return response200({
      basicInfos: data.slice(0, identifierCount),
      unitPrices: data.slice(identifierCount, identifierCount * 2),
      splits: data.slice(identifierCount * 2, identifierCount * 3),
      dividends: data.slice(identifierCount * 3, identifierCount * 4),
    });
  }
}
