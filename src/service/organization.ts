import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { Model } from 'mongoose';
import { Organization } from '../entity/organization';

export interface OrganizationPermissionType {
  organization: any;
  permissions: Array<'Admin' | 'Collaborator' | 'Visitor'>;
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
        permissions.push('Admin');
      }
      if (result.collaboratorList.includes(userId)) {
        permissions.push('Collaborator');
      }
      if (result.visitorList.includes(userId)) {
        permissions.push('Admin');
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
}
