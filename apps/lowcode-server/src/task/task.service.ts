import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ITaskMicroService } from 'apps/task/src/task.controller';
import { BusinessException } from '@lib/common/exceptions/business.exception';
import { JobStatus } from 'bull';

@Injectable()
export class TaskService implements OnModuleInit {
  private taskService: ITaskMicroService;

  constructor(
    @Inject('TASK_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.taskService = this.client.getService<ITaskMicroService>('TaskService');
  }

  async add(name: string, data: Record<string, any>) {
    let dataStr = '';
    try {
      dataStr = JSON.stringify(data);
    } catch (error) {
      throw new BusinessException('data格式有误，序列化失败');
    }
    const res = await lastValueFrom(
      this.taskService.add({
        name,
        data: dataStr,
      }),
    );
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data as string;
  }

  async getState(id: string) {
    const res = await lastValueFrom(this.taskService.getState({ id }));
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data as JobStatus;
  }
}
