import { Controller } from '@nestjs/common';
import { WorkService } from './work.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateWorkDto, FindOneDto, PublishWorkDto } from './dto/work.dto';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { MicroServiceType } from '@lib/common/types/micro-service.type';
import { WorkContent } from './work-content.schema';
import { Work } from './work.entity';
import { IPageInfo } from '@lib/common/types/page-info.type';
import { WORK_STATUS_ENUM } from '@lib/common/enums/work-status.enum';
import { BusinessException } from '@lib/common/exceptions/business.exception';

@Controller()
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @GrpcMethod('WorkService', 'CreateWork')
  async createWork(createWorkDto: CreateWorkDto) {
    try {
      const { content, ...rest } = createWorkDto;
      const res = await this.workService.createWork(
        content ? JSON.parse(content) : {},
        rest,
      );
      return res;
    } catch (e) {
      throw new BusinessException(
        ERRNO_ENUM.WORK_CREATE_FAILED,
        '作品创建失败',
      );
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
        return {
          ...res,
          content: res.content ? JSON.stringify(res.content) : '',
        };
      } else {
        throw new BusinessException(ERRNO_ENUM.WORK_NOT_EXIST, '作品不存在');
      }
    } catch (error) {
      throw new BusinessException(ERRNO_ENUM.WORK_FIND_FAILED, '作品查询失败');
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
        throw new BusinessException(ERRNO_ENUM.WORK_NOT_EXIST, '作品不存在');
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
      return {
        ...work,
        ...rest,
        content,
      };
    } catch (error) {
      throw new BusinessException(
        ERRNO_ENUM.WORK_UPDATE_FAILED,
        '作品更新失败',
      );
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
      return res;
    } catch (error) {
      throw new BusinessException(ERRNO_ENUM.WORK_FIND_FAILED, '作品查询失败');
    }
  }

  @GrpcMethod('WorkService', 'PublishWork')
  async publishWork(dto: PublishWorkDto) {
    const { id, author, isTemplate } = dto;
    const work = (await this.workService.findOne(id, author)) as Work & {
      content: WorkContent;
    };
    if (!work) {
      throw new BusinessException(
        ERRNO_ENUM.WORK_AUTHOR_MISMATCHING,
        '非本人作品',
      );
    }
    if (work.status === WORK_STATUS_ENUM.OFFLINE) {
      throw new BusinessException(ERRNO_ENUM.WORK_FORCE_OFFLINE, '作品已下线');
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
        if (!res) return false;
      }
      return true;
    } catch (error) {
      throw new BusinessException(
        ERRNO_ENUM.WORK_PUBLISH_FAILED,
        '作品发布失败',
      );
    }
  }
}

export type IWorkMicroService = MicroServiceType<typeof WorkController>;
