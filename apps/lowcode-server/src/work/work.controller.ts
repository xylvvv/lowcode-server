import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isEmpty } from 'lodash';

import { BusinessException } from '@lib/common/exceptions/business.exception';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { WorkService } from './work.service';
import { UserService } from '../user/user.service';
import { CreateWorkDto, FindWorksDto, PublishWorkDto } from './work.dto';
import { User } from '../decorators/user.decorator';

@Controller('work')
@UseGuards(AuthGuard('jwt'))
export class WorkController {
  constructor(
    private workService: WorkService,
    private userService: UserService,
  ) {}

  @Post()
  createWork(
    @Body() createWorkDto: CreateWorkDto,
    @User('username') username: string,
  ) {
    return this.workService.createWork({
      author: username,
      ...createWorkDto,
    });
  }

  @Get()
  find(
    @Query() findWorksDto: FindWorksDto,
    @User('username') username: string,
  ) {
    const { pageIndex, pageSize, ...work } = findWorksDto;
    return this.workService.findWorks(username, work, {
      pageIndex,
      pageSize,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @User('username') username: string,
  ) {
    return this.workService.findOne(id, username);
  }

  @Patch(':id')
  updateWork(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
    @User('username') username: string,
  ) {
    if (isEmpty(data)) return '更新成功';
    return this.workService.update(id, username, data);
  }

  @Post('copy/:id')
  async copyWork(
    @Param('id', ParseIntPipe) id: number,
    @User('username') username: string,
  ) {
    const work = await this.workService.findOne(id);
    const { content, title, subtitle, coverImg, status, copiedCount } = work;
    if (status === 3) {
      throw new BusinessException(ERRNO_ENUM.WORK_FORCE_OFFLINE, '作品已下线');
    }
    await this.workService.createWork({
      content,
      title: `${title}-复制`,
      subtitle,
      coverImg,
      author: username,
    });
    await this.workService.update(id, work.author, {
      copiedCount: copiedCount + 1,
    });
    return '复制成功';
  }

  @Delete(':id')
  async deleteWork(
    @Param('id', ParseIntPipe) id: number,
    @User('username') username: string,
  ) {
    await this.workService.update(id, username, { status: 0 });
    return '删除成功';
  }

  @Post('undelete/:id')
  async undelete(
    @Param('id', ParseIntPipe) id: number,
    @User('username') username: string,
  ) {
    await this.workService.update(id, username, { status: 1 });
    return '恢复删除成功';
  }

  @Post('transfer/:id/:receiver')
  async transfer(@Param() params, @User('username') username: string) {
    const { id, receiver } = params;
    if (username === receiver) {
      throw new BusinessException(
        ERRNO_ENUM.AUTHOR_RECEIVER_SAME,
        '作者和接收人相同',
      );
    }
    try {
      await this.userService.findOne(receiver);
      await this.workService.update(id, username, {
        receiver,
      });
    } catch (error) {
      throw new BusinessException(ERRNO_ENUM.WORK_TRANSFER_FAILED, '转赠失败');
    }
    return '转赠成功';
  }

  @Post('publish/:id')
  publish(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PublishWorkDto,
    @User('username') username: string,
  ) {
    const { isTemplate = false } = dto;
    return this.workService.publishWork(id, username, isTemplate);
  }
}
