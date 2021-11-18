import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessTriggerType,
  Config,
  ALL,
  Query,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { Model } from 'mongoose';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { response200, response403, response404 } from '../utils/response';
import { UserService } from '../service/user';
import { Organization } from '../entity/organization';

@Provide()
export class OrganizationHTTPService {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;
  @InjectEntityModel(Organization)
  organizationModel: Model<Organization>;
  @Config(ALL)
  allConfig;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/organization/getAvailableOrganizations',
    method: 'get',
  })
  async getAvailableOrganizations(@Query() session) {
    const loginUser = await this.userService.getUserFromSession(
      session
    );
    if (!loginUser) {
      return response403('');
    }
    try {
      const [
        adminOrganizations,
        collaboratorOrganizations,
        visitorOrganizations,
      ] = await Promise.all([
        this.organizationModel
          .find({ adminList: loginUser._id.toString() })
          .exec(),
        this.organizationModel
          .find({ collaboratorList: loginUser._id.toString() })
          .exec(),
        this.organizationModel
          .find({ visitorList: loginUser._id.toString() })
          .exec(),
      ]);
      return response200(
        [
          ...adminOrganizations,
          ...collaboratorOrganizations,
          ...visitorOrganizations,
        ].map(item => ({ name: item.name, _id: item._id }))
      );
    } catch (e) {
      return response404('');
    }
  }
}
