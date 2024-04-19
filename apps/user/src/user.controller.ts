import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { GrpcMethod } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { MicroServiceType } from '@lib/common/types/micro-service.type';
import { RpcBusinessException } from '@lib/common/exceptions/business.exception';

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
          throw new RpcBusinessException(
            ERRNO_ENUM.PASSWORD_ERROR,
            '用户名密码不匹配',
          );
        }
        return user;
      } else {
        throw new RpcBusinessException(ERRNO_ENUM.USER_NOT_EXIST, '用户不存在');
      }
    } catch (error) {
      throw new RpcBusinessException(
        ERRNO_ENUM.USER_FIND_FAILED,
        '用户查询失败',
      );
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
      return res;
    } catch (error) {
      throw new RpcBusinessException(
        ERRNO_ENUM.USER_CREATE_FAILED,
        '用户创建失败',
      );
    }
  }
}

export type IUserMicroService = MicroServiceType<typeof UserController>;
