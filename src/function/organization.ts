import { ALL, Config, Inject, Provide, ServerlessTrigger, ServerlessTriggerType } from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { Model } from 'mongoose';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { response200, response404 } from '../utils/response';
import { UserService } from '../service/user';
import { OrganizationPermission, OrganizationService } from '../service/organization';
import { Organization } from '../entity/organization';

@Provide()
export class OrganizationHTTPService {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;
  @Inject()
  organizationService: OrganizationService;
  @InjectEntityModel(Organization)
  organizationModel: Model<Organization>;
  @Config(ALL)
  allConfig;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/organization/getAvailableOrganizations',
    method: 'get',
  })
  async getAvailableOrganizations() {
    const { result, errorResponse, user } = await this.userService.checkLoginStatusAndOrganizationPermission(this.ctx.req.headers, null);
    if (!result) {
      return errorResponse;
    }

    try {
      const [adminOrganizations, collaboratorOrganizations, visitorOrganizations] = await Promise.all([
        this.organizationModel.find({ adminList: user._id.toString() }).exec(),
        this.organizationModel.find({ collaboratorList: user._id.toString() }).exec(),
        this.organizationModel.find({ visitorList: user._id.toString() }).exec(),
      ]);
      return response200([...adminOrganizations, ...collaboratorOrganizations, ...visitorOrganizations].map(item => ({ name: item.name, _id: item._id })));
    } catch (e) {
      return response404('');
    }
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/organization/current',
    method: 'get',
  })
  async getCurrentOrganization() {
    const { result, errorResponse, organization, permissionList } = await this.userService.checkLoginStatusAndOrganizationPermission(
      this.ctx.req.headers,
      OrganizationPermission.Visitor
    );
    if (!result) {
      return errorResponse;
    }
    return response200({
      organization: {
        _id: organization._id,
        name: organization.name,
      },
      permissions: permissionList,
    });
  }
}
