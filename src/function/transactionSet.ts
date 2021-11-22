import {
  Inject,
  Provide,
  ServerlessTrigger,
  ServerlessTriggerType,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { UserService } from '../service/user';
import {
  OrganizationPermission,
  OrganizationService,
} from '../service/organization';
import { TransactionSetService } from '../service/transactionSet';

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
    path: '/fund/transactionSet/active',
    method: 'get',
  })
  async getActiveTransactionSets() {
    const { result, errorResponse, organization } =
      await this.userService.checkLoginStatusAndOrganizationPermission(
        this.ctx.req.headers,
        OrganizationPermission.Collaborator
      );
    if (!result) {
      return errorResponse;
    }
    const transactionSets = this.transactionSetService.getActiveTransactionSets(
      organization._id.toString()
    );
    return transactionSets;
  }
}
