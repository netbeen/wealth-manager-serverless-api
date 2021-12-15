import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { Model } from 'mongoose';
import { Organization } from '../entity/organization';
import { Dayjs } from 'dayjs';
import { fetchSplitByIdentifier, fetchUnitPriceByIdentifier, fetchDividendByIdentifier, fetchBasicInfoByIdentifier } from 'fund-tools';
import { getCacheFirstArrayResource, getCacheFirstObjectResource } from '../utils/response';
import { CacheManager } from '@midwayjs/cache';

export interface PriceType {
  date: Dayjs;
  price: number;
}

export interface SplitType {
  date: Dayjs;
  splitRatio: number;
}

export interface DividendType {
  date: Dayjs;
  dividend: number;
}

export interface BasicInfoType {
  identifier: string;
  name: string;
  type: string;
}

@Provide()
export class CrawlerService {
  @InjectEntityModel(Organization)
  organizationModel: Model<Organization>;
  @Inject()
  cache: CacheManager; // 依赖注入CacheManager

  public async fetchUnitPriceByIdentifier(identifier: string): Promise<Array<PriceType>> {
    const result = (await getCacheFirstArrayResource(this.cache, `fetchUnitPriceByIdentifier${identifier}`, fetchUnitPriceByIdentifier(identifier), 3600)) as {
      data: Array<PriceType>;
      from: string;
    };
    return result.data;
  }

  public async fetchSplitByIdentifier(identifier: string): Promise<Array<SplitType>> {
    const result = (await getCacheFirstArrayResource(this.cache, `fetchSplitByIdentifier${identifier}`, fetchSplitByIdentifier(identifier), 3600)) as {
      data: Array<SplitType>;
      from: string;
    };
    return result.data;
  }

  public async fetchDividendByIdentifier(identifier: string): Promise<Array<DividendType>> {
    const result = (await getCacheFirstArrayResource(this.cache, `fetchDividendByIdentifier${identifier}`, fetchDividendByIdentifier(identifier), 3600)) as {
      data: Array<DividendType>;
      from: string;
    };
    return result.data;
  }

  public async fetchBasicInfoByIdentifier(identifier: string): Promise<BasicInfoType> {
    const result = (await getCacheFirstObjectResource(this.cache, `fetchBasicInfoByIdentifier${identifier}`, fetchBasicInfoByIdentifier(identifier), 3600)) as BasicInfoType;
    return result;
  }
}
