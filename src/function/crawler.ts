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
import { response200 } from '../utils/response';

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
    const local = process.env.NODE_ENV === 'local';
    if (local) {
      const remoteResult = await fetchBasicInfoByIdentifier(identifier);
      return { ...remoteResult, from: 'remote' };
    } else {
      const cacheKey = `fetchBasicInfo${identifier}`;
      const cacheResult = (await this.cache.get(cacheKey)) as { name: string };
      if (cacheResult) {
        return { ...cacheResult, from: 'cache' };
      }
      const remoteResult = await fetchBasicInfoByIdentifier(identifier);
      await this.cache.set(cacheKey, remoteResult, {
        ttl: 3600,
      });
      return { ...remoteResult, from: 'remote' };
    }
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/basicInfoUnitPriceSplitDividend/batchQuery',
    method: 'get',
  })
  async batchFetchBasicInfoUnitPriceSplitDividend(@Query() identifiersString) {
    const identifiers = identifiersString.split(',');
    const basicInfos = await Promise.all(
      identifiers.map(identifier => fetchBasicInfoByIdentifier(identifier))
    );
    const unitPrices = await Promise.all(
      identifiers.map(identifier => fetchUnitPriceByIdentifier(identifier))
    );
    const splits = await Promise.all(
      identifiers.map(identifier => fetchSplitByIdentifier(identifier))
    );
    const dividends = await Promise.all(
      identifiers.map(identifier => fetchDividendByIdentifier(identifier))
    );
    return response200({
      basicInfos,
      unitPrices,
      splits,
      dividends,
    });
  }
}
