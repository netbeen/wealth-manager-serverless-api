import { Inject, Body, Provide, ServerlessTrigger, ServerlessTriggerType } from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { UserService } from '../service/user';
import { OrganizationPermission } from '../service/organization';
import { response200 } from '../utils/response';
import { WealthCategoryService } from '../service/wealthCategory';
import { WealthHistoryService } from '../service/wealthHistory';
import dayjs = require('dayjs');

@Provide()
export class WealthHistoryHTTPService {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;
  @Inject()
  wealthCategoryService: WealthCategoryService;
  @Inject()
  wealthHistoryService: WealthHistoryService;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/wealthHistory/create',
    method: 'post',
  })
  // async createHistoryRecord(@Body() date: string, @Body() detail: { [key: string]: number }) {
  async createHistoryRecord(@Body() { date, detail }) {
    const { result, errorResponse, organization } = await this.userService.checkLoginStatusAndOrganizationPermission(this.ctx.req.headers, OrganizationPermission.Collaborator);
    if (!result) {
      return errorResponse;
    }
    const insertResult = await this.wealthHistoryService.insertHistory(dayjs(date), detail, organization._id.toString());
    return response200(insertResult);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/wealthHistory/latestRecord',
    method: 'get',
  })
  async getLatestHistoryRecord() {
    const { result, errorResponse, organization } = await this.userService.checkLoginStatusAndOrganizationPermission(this.ctx.req.headers, OrganizationPermission.Visitor);
    if (!result) {
      return errorResponse;
    }
    const insertResult = await this.wealthHistoryService.getLatestHistoryRecord(organization._id.toString());
    return response200(insertResult);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/wealthHistory/allRecord',
    method: 'get',
  })
  async getAllHistoryRecord() {
    const { result, errorResponse, organization } = await this.userService.checkLoginStatusAndOrganizationPermission(this.ctx.req.headers, OrganizationPermission.Visitor);
    if (!result) {
      return errorResponse;
    }
    const insertResult = await this.wealthHistoryService.getAllHistoryRecord(organization._id.toString());
    return response200(insertResult);
  }
}
