import { Controller } from '@nestjs/common';
import { WorkService } from './work.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateWorkDto, FindOneDto, PublishWorkDto } from './dto/work.dto';
import { ErrorRes, SuccessRes } from '@lib/common/dto/res.dto';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { MicroServiceType } from '@lib/common/types/micro-service.type';
import { WorkContent } from './work-content.schema';
import { Work } from './work.entity';
import { IPageInfo } from '@lib/common/types/page-info.type';
import { WORK_STATUS_ENUM } from '@lib/common/enums/work-status.enum';

@Controller()
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @GrpcMethod('WorkService', 'CreateWork')
  async createWork(createWorkDto: CreateWorkDto) {
    try {
      const { content = '{}', ...rest } = createWorkDto;
      const res = await this.workService.createWork(JSON.parse(content), rest);
      return new SuccessRes(res);
    } catch (e) {
      return new ErrorRes({
        message: '作品创建失败',
        errno: ERRNO_ENUM.WORK_CREATE_FAILED,
      });
    }
  }

  @GrpcMethod('WorkService', 'FindOne')
  async findOne(findOneDto: FindOneDto) {
    try {
      const { id, author } = findOneDto;
      const res = (await this.workService.findOne(id, author)) as Work & {
        content: WorkContent;
      };
      if (res) {
        return new SuccessRes({
          ...res,
          content: res.content ? JSON.stringify(res.content) : '',
        });
      } else {
        return new ErrorRes({
          message: '作品不存在',
          errno: ERRNO_ENUM.WORK_NOT_EXIST,
        });
      }
    } catch (error) {
      return new ErrorRes({
        message: '作品查询失败',
        errno: ERRNO_ENUM.WORK_FIND_FAILED,
      });
    }
  }

  @GrpcMethod('WorkService', 'UpdateWork')
  async updateWork(
    updateWorkDto: Partial<Work> & { content?: string; receiver?: string },
  ) {
    try {
      const { id, author, content, receiver, ...rest } = updateWorkDto;
      const work = await this.workService.findOne(id, author);
      if (!work) {
        return new ErrorRes({
          message: '作品不存在',
          errno: ERRNO_ENUM.WORK_NOT_EXIST,
        });
      }
      await this.workService.updateWork(
        {
          id,
          contentId: work.contentId,
          author: receiver,
          ...rest,
        },
        content ? JSON.parse(content) : null,
      );
      return new SuccessRes({
        ...work,
        ...rest,
        content,
      });
    } catch (error) {
      return new ErrorRes({
        message: '作品更新失败',
        errno: ERRNO_ENUM.WORK_UPDATE_FAILED,
      });
    }
  }

  @GrpcMethod('WorkService', 'FindWorks')
  async findWorks(findWorksDto: Partial<Work> & IPageInfo) {
    const { pageIndex, pageSize, ...rest } = findWorksDto;
    try {
      const res = await this.workService.findWorks(rest, {
        pageIndex,
        pageSize,
      });
      return new SuccessRes(res);
    } catch (error) {
      return new ErrorRes({
        message: '作品查询失败',
        errno: ERRNO_ENUM.WORK_FIND_FAILED,
      });
    }
  }

  @GrpcMethod('WorkService', 'PublishWork')
  async publishWork(dto: PublishWorkDto) {
    const { id, author, isTemplate } = dto;
    const work = (await this.workService.findOne(id, author)) as Work & {
      content: WorkContent;
    };
    if (!work) {
      return new ErrorRes({
        message: '非本人作品',
        errno: ERRNO_ENUM.WORK_AUTHOR_MISMATCHING,
      });
    }
    if (work.status === WORK_STATUS_ENUM.OFFLINE) {
      return new ErrorRes({
        message: '作品已下线',
        errno: ERRNO_ENUM.WORK_FORCE_OFFLINE,
      });
    }
    try {
      const publishContentId =
        await this.workService.updatePublishContentService(
          work.content,
          work.publishContentId,
        );
      if (publishContentId) {
        const res = await this.workService.updateWork({
          id,
          publishContentId,
          status: WORK_STATUS_ENUM.PUBLISH,
          latestPublishAt: new Date(),
          isTemplate,
        });
        if (!res) return new SuccessRes(false);
      }
      return new SuccessRes(true);
    } catch (error) {
      return new ErrorRes({
        message: '作品发布失败',
        errno: ERRNO_ENUM.WORK_PUBLISH_FAILED,
      });
    }
  }
}

export type IWorkMicroService = MicroServiceType<typeof WorkController>;
