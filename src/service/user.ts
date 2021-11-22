import { Provide, Inject } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { Model, Types } from 'mongoose';
import { User } from '../entity/user';
import { OrganizationPermission, OrganizationService } from './organization';
import { Organization } from '../entity/organization';
import { response401, response403 } from '../utils/response';
const jwt = require('jsonwebtoken');

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Model<User>;
  @Inject()
  organizationService: OrganizationService;

  /**
   * 整合和用户身份校验与organization权限校验
   * @param headers
   * @param minimumRequiredPermission
   */
  async checkLoginStatusAndOrganizationPermission(
    headers: { [key: string]: string },
    minimumRequiredPermission: OrganizationPermission | null
  ): Promise<{
    result: boolean;
    errorResponse: { code: number; data?: any; message?: string } | null;
    user: User | null;
    organization: Organization | null;
    permissionList: Array<OrganizationPermission>;
  }> {
    const loginUser = await this.getUserFromToken(headers['x-wm-token']);
    if (!loginUser) {
      return {
        result: false,
        errorResponse: response401('Login Status Validation Failed.'),
        user: null,
        organization: null,
        permissionList: [],
      };
    }
    const organizationData =
      await this.organizationService.getAndVerifyOrganizationFromToken(
        headers['x-wm-organization'],
        loginUser._id.toString()
      );
    if (minimumRequiredPermission) {
      if (
        (minimumRequiredPermission === OrganizationPermission.Visitor &&
          organizationData.permissions.filter(item =>
            [
              OrganizationPermission.Visitor,
              OrganizationPermission.Collaborator,
              OrganizationPermission.Admin,
            ].includes(item)
          ).length === 0) ||
        (minimumRequiredPermission === OrganizationPermission.Collaborator &&
          organizationData.permissions.filter(item =>
            [
              OrganizationPermission.Collaborator,
              OrganizationPermission.Admin,
            ].includes(item)
          ).length === 0) ||
        (minimumRequiredPermission === OrganizationPermission.Admin &&
          organizationData.permissions.filter(item =>
            [OrganizationPermission.Admin].includes(item)
          ).length === 0)
      ) {
        return {
          result: false,
          errorResponse: response403(
            `You don't have the ${minimumRequiredPermission} permission in organization: ${organizationData.organization.name}`
          ),
          user: loginUser,
          organization: organizationData.organization,
          permissionList: organizationData.permissions,
        };
      }
    }
    return {
      result: true,
      errorResponse: null,
      user: loginUser,
      organization: organizationData.organization,
      permissionList: organizationData.permissions,
    };
  }

  async getUserFromToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await this.userModel.findById(decoded._id).exec();
      return result ?? null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async register(username: string, passwordHash: string): Promise<User> {
    try {
      const result = await this.userModel.create({
        _id: new Types.ObjectId(),
        username,
        passwordHash,
      });
      await this.organizationService.createOrganization(
        `${username}的账本`,
        result._id.toString()
      );
      return result;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
}
