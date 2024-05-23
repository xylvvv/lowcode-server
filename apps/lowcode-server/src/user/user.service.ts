import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { IUserMicroService } from 'apps/user-server/src/user/user.controller';
import { User } from 'apps/user-server/src/user/user.entity';
import { BusinessException } from '@lib/common/exceptions/business.exception';
import { IPageInfo } from '@lib/common/types/page-info.type';

@Injectable()
export class UserService implements OnModuleInit {
  private userService: IUserMicroService;

  constructor(
    @Inject('USER_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<IUserMicroService>('UserService');
  }

  async create(user: User) {
    const res = await lastValueFrom(this.userService.create(user));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async findOne(username: string) {
    const res = await lastValueFrom(this.userService.findOne({ username }));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async paginate(pageInfo: IPageInfo) {
    const res = await lastValueFrom(this.userService.paginate(pageInfo));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async delete(id: number) {
    const res = await lastValueFrom(this.userService.delete({ id }));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async update(user: Partial<User> & { assignRoles?: boolean }) {
    const res = await lastValueFrom(this.userService.update(user));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }
}
