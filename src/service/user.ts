import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { Model } from 'mongoose';
import { User } from '../entity/user';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Model<User>;

  async getUserFromSession(session: string): Promise<User | null> {
    return await this.userModel.findById(session).exec();
  }
}
