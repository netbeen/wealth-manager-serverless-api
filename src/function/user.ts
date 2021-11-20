import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessTriggerType,
  Query,
  Body,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { Model } from 'mongoose';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { User } from '../entity/user';
import { response200, response404 } from '../utils/response';
const jwt = require('jsonwebtoken');

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
    path: '/user/login',
    method: 'post',
  })
  async login(@Body() username, @Body() passwordHash) {
    console.log('login', username, passwordHash);
    try {
      const user = await this.userModel
        .findOne({ username, passwordHash })
        .exec();
      if (!user || !user.username) {
        return response404('');
      }
      return response200({
        _id: user._id,
        username: user.username,
        token: jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        }),
      });
    } catch (e) {
      return response404('');
    }
  }
}
