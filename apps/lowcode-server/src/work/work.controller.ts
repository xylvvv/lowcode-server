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
import { ErrorRes, SuccessRes } from '@lib/common/dto/res.dto';
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
  async createWork(@Body() createWorkDto: CreateWorkDto, @Request() req) {
    const { username } = req.user;
    const res = await this.workService.createWork({
      author: username,
      ...createWorkDto,
    });
    return res;
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
  async findOne(@Request() req, @Param('id') id) {
    const { username } = req.user;
    const res = await this.workService.findOne(id, username);
    return res;
  }

  @Patch(':id')
  async updateWork(@Request() req, @Param('id') id, @Body() data: any) {
    const { username } = req.user;
    if (isEmpty(data)) return new SuccessRes('更新成功');
    const res = await this.workService.update(id, username, data);
    return res;
  }

  @Post('copy/:id')
  async copyWork(@Request() req, @Param('id') id) {
    const { username } = req.user;
    const res = await this.workService.findOne(id);
    if (res.errno) return res;
    const { data: work } = res;
    const { content, title, subtitle, coverImg, status, copiedCount } = work;
    if (status === 3) {
      return new ErrorRes({
        errno: ERRNO_ENUM.WORK_FORCE_OFFLINE,
        message: '作品已下线',
      });
    }
    const res2 = await this.workService.createWork({
      content,
      title: `${title}-复制`,
      subtitle,
      coverImg,
      author: username,
    });
    if (res2.errno) return res2;
    await this.workService.update(id, work.author, {
      copiedCount: copiedCount + 1,
    });
    return new SuccessRes('复制成功');
  }

  @Delete(':id')
  async deleteWork(@Request() req, @Param('id') id) {
    const { username } = req.user;
    const res = await this.workService.update(id, username, { status: 0 });
    if (res.errno) {
      return new ErrorRes({
        message: '删除失败',
        errno: ERRNO_ENUM.WORK_DELETE_FAILED,
      });
    }
    return new SuccessRes('删除成功');
  }

  @Post('undelete/:id')
  async undelete(@Request() req, @Param('id') id) {
    const { username } = req.user;
    const res = await this.workService.update(id, username, { status: 1 });
    if (res.errno) {
      return new ErrorRes({
        message: '恢复删除失败',
        errno: ERRNO_ENUM.WORK_DELETE_BACK_FAILED,
      });
    }
    return new SuccessRes('恢复删除成功');
  }

  @Post('transfer/:id/:receiver')
  async transfer(@Request() req, @Param() params) {
    const { id, receiver } = params;
    const { username } = req.user;
    if (username === receiver) {
      return new ErrorRes({
        message: '作者和接收人相同',
        errno: ERRNO_ENUM.AUTHOR_RECEIVER_SAME,
      });
    }
    const user = await this.userService.findOne(receiver);
    if (!user) {
      return new ErrorRes({
        message: '接收人不存在',
        errno: ERRNO_ENUM.USER_FIND_FAILED,
      });
    }
    const res = await this.workService.update(id, username, {
      receiver,
    });
    if (res.errno) {
      return new ErrorRes({
        message: '转赠失败',
        errno: ERRNO_ENUM.WORK_TRANSFER_FAILED,
      });
    }
    return new SuccessRes('转赠成功');
  }

  @Post('publish/:id')
  publish(@Request() req, @Param('id') id, @Body() dto: PublishWorkDto) {
    const { username } = req.user;
    const { isTemplate = false } = dto;
    return this.workService.publishWork(id, username, isTemplate);
  }
}
