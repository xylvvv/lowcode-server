import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ResourceService } from './resource.service';
import { IPageInfo } from '@lib/common/types/page-info.type';
import { BusinessException } from '@lib/common/exceptions/business.exception';
import { MicroServiceType } from '@lib/common/types/micro-service.type';
import { Resource } from './resource.entity';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';

@Controller()
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  private readonly logger = new Logger(ResourceController.name);

  @GrpcMethod('ResourceService', 'Paginate')
  async paginate(pageInfo: IPageInfo) {
    try {
      return await this.resourceService.paginate(pageInfo);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException('资源列表查询失败');
    }
  }

  @GrpcMethod('ResourceService', 'Create')
  async create(resource: Partial<Resource>) {
    if (resource.subject) {
      const exist = await this.resourceService.findUnique(resource.subject);
      if (exist) {
        throw new BusinessException(
          ERRNO_ENUM.RESOURCE__EXISTED,
          '该资源已存在',
        );
      }
    }
    try {
      return await this.resourceService.create(resource);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException('资源创建失败');
    }
  }

  @GrpcMethod('ResourceService', 'Update')
  async update({ id, ...resource }: Partial<Resource>) {
    const data = await this.resourceService.findUnique(resource.subject);
    if (data && data.id !== id) {
      throw new BusinessException(ERRNO_ENUM.RESOURCE__EXISTED, '该资源已存在');
    }
    try {
      return await this.resourceService.update(id, resource);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException('资源更新失败');
    }
  }

  @GrpcMethod('ResourceService', 'Delete')
  async delete({ id }: { id: number }) {
    try {
      return await this.resourceService.delete(id);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException('资源删除失败');
    }
  }
}

export type IResourceMicroService = MicroServiceType<typeof ResourceController>;
