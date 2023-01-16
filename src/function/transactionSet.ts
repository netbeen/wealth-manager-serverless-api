import { Inject, Provide, Query, ServerlessTrigger, ServerlessTriggerType } from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { UserService } from '../service/user';
import { OrganizationPermission, OrganizationService } from '../service/organization';
import { TransactionSetService, TransactionSetStatus } from '../service/transactionSet';
import { response200, response400, response404 } from '../utils/response';

@Provide()
export class TransactionSetHTTPService {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;
  @Inject()
  organizationService: OrganizationService;
  @Inject()
  transactionSetService: TransactionSetService;

  /**
   * 获取所有活跃/归档的交易集
   * @param status
   */
  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/transactionSet',
    method: 'get',
  })
  async getActiveTransactionSets(@Query() { status }) {
    if (status && ![TransactionSetStatus.Active, TransactionSetStatus.Archived].includes(status)) {
      return response400('Params Error');
    }
    const { result, errorResponse, organization } = await this.userService.checkLoginStatusAndOrganizationPermission(this.ctx.req.headers, OrganizationPermission.Visitor);
    if (!result) {
      return errorResponse;
    }
    let returnResult: any = null;
    if (!status) {
      returnResult = await this.transactionSetService.getTransactionSets(organization._id.toString());
    } else if (status === TransactionSetStatus.Archived) {
      returnResult = await this.transactionSetService.getTransactionSets(organization._id.toString(), TransactionSetStatus.Archived);
    } else {
      returnResult = await this.transactionSetService.getTransactionSets(organization._id.toString(), TransactionSetStatus.Active);
    }
    return response200(returnResult);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/getTransactionSetById',
    method: 'get',
  })
  async getTransactionSetById(@Query() { id }) {
    const { result, errorResponse, organization } = await this.userService.checkLoginStatusAndOrganizationPermission(this.ctx.req.headers, OrganizationPermission.Visitor);
    if (!result) {
      return errorResponse;
    }
    const findResult = await this.transactionSetService.getTransactionSetById(id, organization._id.toString());
    if (findResult) {
      return response200(findResult);
    } else {
      return response404('');
    }
  }
}
