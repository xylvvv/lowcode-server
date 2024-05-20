import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { IRoleMicroService } from 'apps/user-server/src/role/role.controller';
import { BusinessException } from '@lib/common/exceptions/business.exception';
import { IPageInfo } from '@lib/common/types/page-info.type';
import { Role } from 'apps/user-server/src/role/role.entity';

@Injectable()
export class RoleService implements OnModuleInit {
  private roleService: IRoleMicroService;

  constructor(
    @Inject('ROLE_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.roleService = this.client.getService<IRoleMicroService>('RoleService');
  }

  async paginate(pageInfo: IPageInfo) {
    const res = await firstValueFrom(this.roleService.paginate(pageInfo));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async create(role: Partial<Role>) {
    const res = await firstValueFrom(this.roleService.create(role));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async update(role: Partial<Role>) {
    const res = await firstValueFrom(this.roleService.update(role));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async assignPermissions({ id, permissions }: Partial<Role>) {
    const res = await firstValueFrom(
      this.roleService.assignPermissions({
        id,
        permissions,
      }),
    );
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async delete(id: number) {
    const res = await firstValueFrom(this.roleService.delete({ id }));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async findOne(id: number) {
    const res = await firstValueFrom(this.roleService.findOne({ id }));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }
}
