import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { MicroServiceType } from '@lib/common/types/micro-service.type';
import { BusinessException } from '@lib/common/exceptions/business.exception';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';

@Controller()
export class TaskController {
  constructor(@InjectQueue('task') private taskQueue: Queue) {}

  private logger = new Logger(TaskController.name);

  @GrpcMethod('TaskService', 'Add')
  async add({ name, data }: { name: string; data: string }) {
    try {
      const job = await this.taskQueue.add(name, JSON.parse(data));
      return job.id;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException(
        ERRNO_ENUM.TASK_ADD_FAILED,
        '任务添加失败',
      );
    }
  }

  @GrpcMethod('TaskService', 'GetState')
  async getState({ id }: { id: string }) {
    try {
      const job = await this.taskQueue.getJob(id);
      const state = await job.getState();
      return state;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException(
        ERRNO_ENUM.TASK_FIND_FAILED,
        '任务查询失败',
      );
    }
  }
}

export type ITaskMicroService = MicroServiceType<typeof TaskController>;
