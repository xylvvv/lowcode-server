import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IUserMicroService } from 'apps/user/src/user.controller';
import { User } from 'apps/user/src/user.entity';
import { firstValueFrom } from 'rxjs';

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
    if (!res.errno) {
      return res.data;
    } else {
      throw res;
    }
  }

  async findOne(username: string, password?: string) {
    const res = await firstValueFrom(
      this.userService.findOne({ username, password }),
    );
    if (!res.errno) {
      return res.data;
    } else if (res.errno === ERRNO_ENUM.USER_NOT_EXIST) {
      return null;
    } else {
      throw res;
    }
  }
}
