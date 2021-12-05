import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
// @ts-ignore
import { Model, Types } from 'mongoose';
import { WealthCategory } from '../entity/wealthCategory';

@Provide()
export class WealthCategoryService {
  @InjectEntityModel(WealthCategory)
  wealthCategoryModel: Model<WealthCategory>;

  async findAllWealthCategory(): Promise<Array<WealthCategory>> {
    try {
      return await this.wealthCategoryModel.find();
    } catch (e) {
      throw new Error(e);
    }
  }
}
