import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

import { UserService } from './user.service';
import { User } from './user.entity';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { MicroServiceType } from '@lib/common/types/micro-service.type';
import { BusinessException } from '@lib/common/exceptions/business.exception';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(UserController.name);

  @GrpcMethod('UserService', 'FindOne')
  async findOne({
    username,
    password,
  }: {
    username: string;
    password?: string;
  }) {
    let user;
    try {
      user = await this.userService.findOne(username);
    } catch (error) {
      throw new BusinessException(ERRNO_ENUM.USER_FIND_FAILED, '用户查询失败');
    }
    if (!user) {
      throw new BusinessException(ERRNO_ENUM.USER_NOT_EXIST, '用户不存在');
    }
    if (password && !bcrypt.compareSync(password, user.password)) {
      throw new BusinessException(
        ERRNO_ENUM.PASSWORD_ERROR,
        '用户名密码不匹配',
      );
    }
    return user;
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
      return await this.userService.createUser(user);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException(
        ERRNO_ENUM.USER_CREATE_FAILED,
        '用户创建失败',
      );
    }
  }
}

export type IUserMicroService = MicroServiceType<typeof UserController>;
