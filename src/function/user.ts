import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessTriggerType,
  Query,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { Model } from 'mongoose';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { User } from '../entity/user';
import { response200, response404 } from '../utils/response';

@Provide()
export class UserHTTPService {
  @Inject()
  ctx: Context;
  @InjectEntityModel(User)
  userModel: Model<User>;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/user/getByIdentifier',
    method: 'get',
  })
  async getByIdentifier(@Query() identifier) {
    console.log('input identifier', identifier);
    try {
      const user = await this.userModel.findById(identifier).exec();
      if (!user) {
        return response404('');
      }
      return response200({ _id: user._id, username: user.username });
    } catch (e) {
      return response404('');
    }
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/user/getByIdentifierAndPasswordHash',
    method: 'get',
  })
  async getByIdentifierAndPasswordHash(
    @Query() username,
    @Query() passwordHash
  ) {
    try {
      const user = await this.userModel
        .findOne({ username, passwordHash })
        .exec();
      if (!user || !user.username) {
        return response404('');
      }
      return response200({ _id: user._id, username: user.username });
    } catch (e) {
      return response404('');
    }
  }
}
