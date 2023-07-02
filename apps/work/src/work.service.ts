import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkContentDocument } from './work-content.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Work } from './work.entity';
import { Like, Not, Repository } from 'typeorm';
import { WorkContent } from './work-content.schema';
import { isEmpty, omit } from 'lodash';
import { IPageInfo } from '@lib/common/types/page-info.type';
import { WORK_STATUS_ENUM } from '@lib/common/enums/work-status.enum';

@Injectable()
export class WorkService {
  constructor(
    @InjectModel('WorkContent')
    private workContentModel: Model<WorkContentDocument>,
    @InjectModel('WorkPublishContent')
    private workPublishContentModel: Model<WorkContentDocument>,
    @InjectRepository(Work)
    private workRepository: Repository<Work>,
  ) {}

  async createWork(content: WorkContent, work: Partial<Work>) {
    const { components = [], setting = {}, page = [] } = content;
    const { _id } = await this.workContentModel.create({
      components,
      setting,
      page,
    });
    const entity = this.workRepository.create({
      ...work,
      contentId: _id.toString(),
    });
    const res = await this.workRepository.save(entity);
    return res;
  }

  async findOne(id: number, author?: string) {
    const work = await this.workRepository.findOneBy({
      id,
      author,
    });
    if (work) {
      const { contentId } = work;
      const content = await this.workContentModel.findById(contentId);
      return {
        ...work,
        content,
      };
    }
    return work;
  }

  async updateWork(work: Partial<Work>, content?: WorkContent) {
    if (content) {
      const { contentId } = work;
      await this.workContentModel.findByIdAndUpdate(contentId, content);
    }
    const data = omit(work, ['id', 'uuid', 'contentId', 'content']);
    if (isEmpty(data)) {
      return false;
    }
    const res = await this.workRepository.update(work.id, data);
    return res.affected !== 0;
  }

  async findWorks(query: Omit<Partial<Work>, 'setUUID'>, pageInfo: IPageInfo) {
    const { pageIndex = 1, pageSize = 10 } = pageInfo;
    const { title, status, isTemplate, ...rest } = query;
    const where = { ...rest };
    if (title) {
      Object.assign(where, {
        title: Like(`%${title}%`),
      });
    }
    if (isTemplate !== undefined) {
      Object.assign(where, {
        isTemplate,
      });
    }

    Object.assign(where, {
      status:
        status === undefined ? Not(`${WORK_STATUS_ENUM.DELETE}`) : `${status}`,
    });
    const [list, total] = await this.workRepository.findAndCount({
      take: pageSize,
      skip: pageSize * (pageIndex - 1),
      order: {
        sort: 'DESC',
        id: 'DESC',
      },
      where,
    });
    return { list, total };
  }

  async updatePublishContentService(
    content?: WorkContent,
    publishContentId?: string,
  ) {
    if (!content) return;
    const { components = [], page = {}, setting = {} } = content;
    if (publishContentId) {
      await this.workPublishContentModel.findByIdAndUpdate(publishContentId, {
        components,
        page,
        setting,
      });
      return publishContentId;
    }
    const newPublishContent = await this.workPublishContentModel.create({
      components,
      page,
      setting,
    });
    return newPublishContent._id.toString();
  }
}
