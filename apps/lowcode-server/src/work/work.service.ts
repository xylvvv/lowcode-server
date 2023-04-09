import { IPageInfo } from '@lib/common/types/page-info.type';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IWorkMicroService } from 'apps/work/src/work.controller';
import { firstValueFrom } from 'rxjs';

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

  createWork(data: any) {
    const { content, ...rest } = data;
    return firstValueFrom(
      this.workService.createWork({
        ...rest,
        content: content ? JSON.stringify(content) : null,
      }),
    );
  }

  async findOne(id: number, author?: string) {
    const res = await firstValueFrom(this.workService.findOne({ id, author }));
    if (!res.errno) {
      res.data.content = res.data.content ? JSON.parse(res.data.content) : null;
    }
    return res;
  }

  async update(id: number, author: string, data: any) {
    const { content, ...rest } = data;
    const res = await firstValueFrom(
      this.workService.updateWork({
        ...rest,
        id,
        author,
        content: content ? JSON.stringify(content) : null,
      }),
    );
    if (!res.errno) {
      res.data.content = res.data.content ? JSON.parse(res.data.content) : null;
    }
    return res;
  }

  findWorks(author: string, data: any, pageInfo: IPageInfo) {
    return this.workService.findWorks({
      ...data,
      author,
      ...pageInfo,
    });
  }

  publishWork(id: number, author: string, isTemplate: boolean) {
    return this.workService.publishWork({ id, author, isTemplate });
  }
}
