import {
  Body,
  Query,
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
import { TransactionService } from '../service/transaction';
import { response200 } from '../utils/response';

@Provide()
export class TransactionHTTPService {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;
  @Inject()
  organizationService: OrganizationService;
  @Inject()
  transactionService: TransactionService;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/transaction',
    method: 'post',
  })
  async createTransaction(
    @Body() target,
    @Body() volume,
    @Body() commission,
    @Body() date,
    @Body() direction
  ) {
    const { result, errorResponse, user, organization } =
      await this.userService.checkLoginStatusAndOrganizationPermission(
        this.ctx.req.headers,
        OrganizationPermission.Collaborator
      );
    if (!result) {
      return errorResponse;
    }
    const transaction = this.transactionService.insertTransaction(
      target,
      volume,
      commission,
      date,
      direction,
      user._id.toString(),
      organization._id.toString()
    );
    return transaction;
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/transaction',
    method: 'get',
  })
  async getTransaction(@Query() transactionSet) {
    const { result, errorResponse } =
      await this.userService.checkLoginStatusAndOrganizationPermission(
        this.ctx.req.headers,
        OrganizationPermission.Visitor
      );
    if (!result) {
      return errorResponse;
    }
    const transaction = this.transactionService.findTransaction(transactionSet);
    return transaction;
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/fund/transaction/batchQuery',
    method: 'get',
  })
  async getTransactionBatchQuery(@Query() transactionSetsString) {
    const transactionSets = transactionSetsString.split(',');
    const { result, errorResponse } =
      await this.userService.checkLoginStatusAndOrganizationPermission(
        this.ctx.req.headers,
        OrganizationPermission.Visitor
      );
    if (!result) {
      return errorResponse;
    }
    const transaction = await Promise.all(
      transactionSets.map(transactionSet =>
        this.transactionService.findTransaction(transactionSet)
      )
    );
    return response200(transaction);
  }
}
