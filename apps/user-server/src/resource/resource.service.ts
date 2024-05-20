import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Resource } from './resource.entity';
import { IPageInfo } from '@lib/common/types/page-info.type';

@Injectable()
export class ResourceService {
  @InjectRepository(Resource)
  private readonly resourceRepository: Repository<Resource>;

  async paginate({ pageIndex, pageSize }: IPageInfo) {
    const [list, total] = await this.resourceRepository.findAndCount({
      take: pageSize,
      skip: pageSize * (pageIndex - 1),
      order: {
        id: 'DESC',
      },
    });
    return { list, total };
  }

  async create(resource: Partial<Resource>) {
    const entity = this.resourceRepository.create(resource);
    // save会先查再执行（更新或创建）返回的是实体；insert只执行创建，返回的是执行结果
    const res = await this.resourceRepository.insert(entity);
    return !!res;
  }

  async delete(...ids: number[]) {
    const { affected } = await this.resourceRepository.delete(ids);
    return affected === ids.length;
  }

  async update(id: number, resouce: Partial<Resource>) {
    const { affected } = await this.resourceRepository.update(id, resouce);
    return affected === 1;
  }

  findUnique(subject: string) {
    return this.resourceRepository.findOneBy({ subject });
  }
}
