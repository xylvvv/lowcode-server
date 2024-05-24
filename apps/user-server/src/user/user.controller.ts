import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

import { UserService } from './user.service';
import { User } from './user.entity';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { MicroServiceType } from '@lib/common/types/micro-service.type';
import { BusinessException } from '@lib/common/exceptions/business.exception';
import { IPageInfo } from '@lib/common/types/page-info.type';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(UserController.name);

  @GrpcMethod('UserService', 'FindOne')
  async findOne({ username }: { username: string }) {
    try {
      return await this.userService.findOne(username);
    } catch (error) {
      throw new BusinessException(ERRNO_ENUM.USER_FIND_FAILED, '用户查询失败');
    }
  }

  @GrpcMethod('UserService', 'Create')
  async create(user: Partial<User>) {
    const { username, password, phone, nickname, picture } = user;
    const exist = await this.userService.findUnique({ username });
    if (exist) {
      throw new BusinessException(ERRNO_ENUM.USER_EXISTED, '该用户已存在');
    }
    try {
      return await this.userService.create({
        username,
        phone,
        password,
        nickname,
        picture,
      });
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException(
        ERRNO_ENUM.USER_CREATE_FAILED,
        '用户创建失败',
      );
    }
  }

  @GrpcMethod('UserService', 'Paginate')
  async paginate(pageInfo: IPageInfo) {
    try {
      return await this.userService.paginate(pageInfo);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException('用户列表查询失败');
    }
  }

  @GrpcMethod('UserService', 'Delete')
  async delete({ id }: { id: number }) {
    try {
      return await this.userService.delete(id);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException('用户删除失败');
    }
  }

  @GrpcMethod('UserService', 'Update')
  async update({
    id,
    roles = [],
    assignRoles,
    ...user
  }: Partial<User> & { assignRoles?: boolean }) {
    try {
      let res = await this.userService.update(id, user);
      if (res && assignRoles) {
        res = !!(await this.userService.assignRoles(id, roles));
      }
      return res;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException('用户更新失败');
    }
  }
}

export type IUserMicroService = MicroServiceType<typeof UserController>;
