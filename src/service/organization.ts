import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { Model, Types } from 'mongoose';
import { Organization } from '../entity/organization';

export enum OrganizationPermission {
  Admin = 'Admin',
  Collaborator = 'Collaborator',
  Visitor = 'Visitor',
}

export interface OrganizationPermissionType {
  organization: any;
  permissions: Array<OrganizationPermission>;
}

@Provide()
export class OrganizationService {
  @InjectEntityModel(Organization)
  organizationModel: Model<Organization>;

  async getAndVerifyOrganizationFromToken(
    organizationIdFromToken: string,
    userId: string
  ): Promise<{
    organization: Organization | null;
    permissions: OrganizationPermissionType['permissions'];
  }> {
    try {
      const result = await this.organizationModel
        .findById(organizationIdFromToken)
        .exec();
      const permissions: OrganizationPermissionType['permissions'] = [];
      if (result.adminList.includes(userId)) {
        permissions.push(OrganizationPermission.Admin);
      }
      if (result.collaboratorList.includes(userId)) {
        permissions.push(OrganizationPermission.Collaborator);
      }
      if (result.visitorList.includes(userId)) {
        permissions.push(OrganizationPermission.Visitor);
      }
      return {
        organization: result ?? null,
        permissions,
      };
    } catch (e) {
      console.log(e);
      return {
        organization: null,
        permissions: [],
      };
    }
  }

  async createOrganization(
    name: string,
    userId: string
  ): Promise<Organization> {
    try {
      const result = await this.organizationModel.create({
        _id: new Types.ObjectId(),
        name,
        adminList: [userId],
        collaboratorList: [],
        visitorList: [],
      });
      return result;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
}
