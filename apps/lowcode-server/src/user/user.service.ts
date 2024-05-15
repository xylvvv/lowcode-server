import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { IUserMicroService } from 'apps/user-server/src/user/user.controller';
import { User } from 'apps/user-server/src/user/user.entity';
import { BusinessException } from '@lib/common/exceptions/business.exception';

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

  async createUser(user: User) {
    const res = await firstValueFrom(this.userService.createUser(user));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async findOne(username: string, password?: string) {
    const res = await firstValueFrom(
      this.userService.findOne({ username, password }),
    );
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }
}
