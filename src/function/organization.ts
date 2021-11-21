import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessTriggerType,
  Config,
  ALL,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { Model } from 'mongoose';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { response200, response401, response404 } from '../utils/response';
import { UserService } from '../service/user';
import { OrganizationService } from '../service/organization';
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
    const loginUser = await this.userService.getUserFromToken(
      this.ctx.req.headers['x-wm-token']
    );
    if (!loginUser) {
      return response401('');
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

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/organization/current',
    method: 'get',
  })
  async getCurrentOrganization() {
    const loginUser = await this.userService.getUserFromToken(
      this.ctx.req.headers['x-wm-token']
    );
    if (!loginUser || !loginUser._id) {
      return response401('');
    }
    try {
      const organizationWithPermissions =
        await this.organizationService.getAndVerifyOrganizationFromToken(
          this.ctx.req.headers['x-wm-organization'],
          loginUser._id.toString()
        );
      return response200({
        organization: {
          _id: organizationWithPermissions.organization._id,
          name: organizationWithPermissions.organization.name,
        },
        permissions: organizationWithPermissions.permissions,
      });
    } catch (e) {
      return response401('');
    }
  }
}
