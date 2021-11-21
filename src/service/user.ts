import { Provide, Inject } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { Model, Types } from 'mongoose';
import { User } from '../entity/user';
import { OrganizationService } from './organization';
const jwt = require('jsonwebtoken');

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Model<User>;
  @Inject()
  organizationService: OrganizationService;

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
