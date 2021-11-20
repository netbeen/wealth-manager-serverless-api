import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { Model } from 'mongoose';
import { User } from '../entity/user';
const jwt = require('jsonwebtoken');

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Model<User>;

  async getUserFromToken(token: string): Promise<User | null> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await this.userModel.findById(decoded._id).exec();
    return result ?? null;
  }
}
