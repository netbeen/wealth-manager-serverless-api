import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessTriggerType,
  Body,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { Model } from 'mongoose';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { User } from '../entity/user';
import { response200, response404 } from '../utils/response';
import { UserService } from '../service/user';
const jwt = require('jsonwebtoken');

@Provide()
export class UserHTTPService {
  @Inject()
  ctx: Context;
  @InjectEntityModel(User)
  userModel: Model<User>;
  @Inject()
  userService: UserService;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/user/me',
    method: 'get',
  })
  async getByIdentifier() {
    const { result, errorResponse, user } =
      await this.userService.checkLoginStatusAndOrganizationPermission(
        this.ctx.headers,
        null
      );
    if (!result) {
      return errorResponse;
    }
    return response200({ _id: user._id, username: user.username });
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/user/login',
    method: 'post',
  })
  async login(@Body() username, @Body() passwordHash) {
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
          expiresIn: '365d',
        }),
      });
    } catch (e) {
      return response404('');
    }
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/user/register',
    method: 'post',
  })
  async register(@Body() username, @Body() passwordHash) {
    try {
      const user = await this.userService.register(username, passwordHash);
      return response200({
        _id: user._id,
        username: user.username,
      });
    } catch (e) {
      return response404('');
    }
  }
}
