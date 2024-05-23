import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { IWorkMicroService } from 'apps/work/src/work.controller';
import { IPageInfo } from '@lib/common/types/page-info.type';
import { BusinessException } from '@lib/common/exceptions/business.exception';

@Injectable()
export class WorkService implements OnModuleInit {
  private workService: IWorkMicroService;

  constructor(
    @Inject('WORK_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.workService = this.client.getService<IWorkMicroService>('WorkService');
  }

  async createWork(data: any) {
    const { content, ...rest } = data;
    const res = await lastValueFrom(
      this.workService.createWork({
        ...rest,
        content: content ? JSON.stringify(content) : null,
      }),
    );
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async findOne(id: number, author?: string) {
    const res = await lastValueFrom(this.workService.findOne({ id, author }));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return {
      ...res.data,
      content: res.data.content ? JSON.parse(res.data.content) : null,
    };
  }

  async update(id: number, author: string, data: any) {
    const { content, ...rest } = data;
    const res = await lastValueFrom(
      this.workService.updateWork({
        ...rest,
        id,
        author,
        content: content ? JSON.stringify(content) : null,
      }),
    );
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return {
      ...res.data,
      content: res.data.content ? JSON.parse(res.data.content) : null,
    };
  }

  async findWorks(author: string, data: any, pageInfo: IPageInfo) {
    const res = await lastValueFrom(
      this.workService.findWorks({
        ...data,
        author,
        ...pageInfo,
      }),
    );
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async publishWork(id: number, author: string, isTemplate: boolean) {
    const res = await lastValueFrom(
      this.workService.publishWork({ id, author, isTemplate }),
    );
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }
}
