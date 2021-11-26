import { Inject, Provide, Query, ServerlessTrigger, ServerlessTriggerType } from "@midwayjs/decorator";
import { Context } from "@midwayjs/faas";
import { UserService } from "../service/user";
import { OrganizationPermission, OrganizationService } from "../service/organization";
import { TransactionSetService, TransactionSetStatus } from "../service/transactionSet";
import { response400 } from "../utils/response";

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

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/transactionSet',
    method: 'get',
  })
  async getActiveTransactionSets(@Query() status) {
    if (![TransactionSetStatus.Active, TransactionSetStatus.Archived].includes(status)) {
      return response400('Params Error');
    }
    const { result, errorResponse, organization } = await this.userService.checkLoginStatusAndOrganizationPermission(this.ctx.req.headers, OrganizationPermission.Collaborator);
    if (!result) {
      return errorResponse;
    }
    return status === TransactionSetStatus.Archived
      ? await this.transactionSetService.getArchivedTransactionSets(organization._id.toString())
      : await this.transactionSetService.getActiveTransactionSets(organization._id.toString());
  }
}
