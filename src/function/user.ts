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
// import jwt from 'jsonwebtoken';

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
    path: '/user/login3',
    method: 'post',
  })
  async loginTest(@Body() username, @Body() passwordHash) {
    return response200({});
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/user/login',
    method: 'post',
  })
  async login(@Body() username, @Body() passwordHash) {
    console.log('login', username, passwordHash);
    return response200({});
    // try {
    //   const user = await this.userModel
    //     .findOne({ username, passwordHash })
    //     .exec();
    //   if (!user || !user.username) {
    //     return response404('');
    //   }
    //   return response200({
    //     _id: user._id,
    //     username: user.username,
    //     // token: jwt.sign({ foo: 'bar' }, process.env.JWT_SECRET, {
    //     //   expiresIn: '7d',
    //     // }),
    //   });
    // } catch (e) {
    //   return response404('');
    // }
  }
}
