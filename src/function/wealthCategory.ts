import { Inject, Provide, ServerlessTrigger, ServerlessTriggerType } from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { UserService } from '../service/user';
import { OrganizationPermission } from '../service/organization';
import { response200 } from '../utils/response';
import { WealthCategoryService } from '../service/wealthCategory';

@Provide()
export class WealthCategoryHTTPService {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;
  @Inject()
  wealthCategoryService: WealthCategoryService;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/wealthCategory/findAll',
    method: 'get',
  })
  async findAllWealthCategory() {
    const { result, errorResponse } = await this.userService.checkLoginStatusAndOrganizationPermission(this.ctx.req.headers, OrganizationPermission.Visitor);
    if (!result) {
      return errorResponse;
    }
    const wealthCategoryList = await this.wealthCategoryService.findAllWealthCategory();
    return response200(wealthCategoryList);
  }
}
