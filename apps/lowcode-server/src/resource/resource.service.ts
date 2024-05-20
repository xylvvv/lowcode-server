import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { IResourceMicroService } from 'apps/user-server/src/resource/resource.controller';
import { BusinessException } from '@lib/common/exceptions/business.exception';
import { IPageInfo } from '@lib/common/types/page-info.type';
import { Resource } from 'apps/user-server/src/resource/resource.entity';

@Injectable()
export class ResourceService implements OnModuleInit {
  private resourceService: IResourceMicroService;

  constructor(
    @Inject('RESOURCE_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.resourceService =
      this.client.getService<IResourceMicroService>('ResourceService');
  }

  async paginate(pageInfo: IPageInfo) {
    const res = await firstValueFrom(this.resourceService.paginate(pageInfo));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async create(resource: Partial<Resource>) {
    const res = await firstValueFrom(this.resourceService.create(resource));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async update(resource: Partial<Resource>) {
    const res = await firstValueFrom(this.resourceService.update(resource));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async delete(id: number) {
    const res = await firstValueFrom(this.resourceService.delete({ id }));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }
}
