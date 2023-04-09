import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { GrpcMethod } from '@nestjs/microservices';
import { ErrorRes, SuccessRes } from '@lib/common/dto/res.dto';
import * as bcrypt from 'bcrypt';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { MicroServiceType } from '@lib/common/types/micro-service.type';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'FindOne')
  async findOne({
    username,
    password,
  }: {
    username: string;
    password?: string;
  }) {
    try {
      const user = await this.userService.findOne(username);
      if (user) {
        if (password && !bcrypt.compareSync(password, user.password)) {
          return new ErrorRes({
            message: '用户名密码不匹配',
            errno: ERRNO_ENUM.PASSWORD_ERROR,
          });
        }
        return new SuccessRes(user);
      } else {
        return new ErrorRes({
          message: '用户不存在',
          errno: ERRNO_ENUM.USER_NOT_EXIST,
        });
      }
    } catch (error) {
      return new ErrorRes({
        message: '用户查询失败',
        errno: ERRNO_ENUM.USER_FIND_FAILED,
      });
    }
  }

  @GrpcMethod('UserService', 'CreateUser')
  async createUser({
    username,
    password,
    phone,
  }: {
    username: string;
    password: string;
    phone: string;
  }) {
    const user = new User();
    user.username = username;
    user.password = await bcrypt.hash(password, 10);
    user.phone = phone;
    try {
      const res = await this.userService.createUser(user);
      return new SuccessRes(res);
    } catch (error) {
      return new ErrorRes({
        message: '用户创建失败',
        errno: ERRNO_ENUM.USER_CREATE_FAILED,
      });
    }
  }
}

export type IUserMicroService = MicroServiceType<typeof UserController>;
