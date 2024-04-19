import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateWorkDto, FindWorksDto, PublishWorkDto } from '../dto/work.dto';
import { AuthGuard } from '@nestjs/passport';
import { WorkService } from './work.service';
import { isEmpty } from 'lodash';
import { BusinessException } from '@lib/common/exceptions/business.exception';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { UserService } from '../user/user.service';

@Controller('work')
@UseGuards(AuthGuard('jwt'))
export class WorkController {
  constructor(
    private workService: WorkService,
    private userService: UserService,
  ) {}
  @Post()
  createWork(@Body() createWorkDto: CreateWorkDto, @Request() req) {
    const { username } = req.user;
    return this.workService.createWork({
      author: username,
      ...createWorkDto,
    });
  }

  @Get()
  find(@Request() req, @Query() findWorksDto: FindWorksDto) {
    const { username } = req.user;
    const { pageIndex, pageSize, isTemplate, ...rest } = findWorksDto;
    return this.workService.findWorks(
      username,
      {
        ...rest,
        isTemplate: isTemplate ? ['1', 'true'].includes(isTemplate) : undefined,
      },
      {
        pageIndex: pageIndex ? Number(pageIndex) : 1,
        pageSize: pageSize ? Number(pageSize) : 10,
      },
    );
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id) {
    const { username } = req.user;
    return this.workService.findOne(id, username);
  }

  @Patch(':id')
  updateWork(@Request() req, @Param('id') id, @Body() data: any) {
    const { username } = req.user;
    if (isEmpty(data)) return '更新成功';
    return this.workService.update(id, username, data);
  }

  @Post('copy/:id')
  async copyWork(@Request() req, @Param('id') id) {
    const { username } = req.user;
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
  async deleteWork(@Request() req, @Param('id') id) {
    const { username } = req.user;
    await this.workService.update(id, username, { status: 0 });
    return '删除成功';
  }

  @Post('undelete/:id')
  async undelete(@Request() req, @Param('id') id) {
    const { username } = req.user;
    await this.workService.update(id, username, { status: 1 });
    return '恢复删除成功';
  }

  @Post('transfer/:id/:receiver')
  async transfer(@Request() req, @Param() params) {
    const { id, receiver } = params;
    const { username } = req.user;
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
  publish(@Request() req, @Param('id') id, @Body() dto: PublishWorkDto) {
    const { username } = req.user;
    const { isTemplate = false } = dto;
    return this.workService.publishWork(id, username, isTemplate);
  }
}
