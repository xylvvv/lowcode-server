import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ResourceService } from './resource.service';
import { CreateResourceDto, UpdateResourceDto } from './resource.dto';
import {
  PermissionAction,
  PermissionSubject,
} from '@lib/common/enums/permission.enum';
import { Permission } from '../auth/decorators/permission.decorator';

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  @Permission(PermissionSubject.RESOURCE, PermissionAction.READ)
  find(
    @Query('pageIndex', new DefaultValuePipe(1)) pageIndex: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.resourceService.paginate({ pageIndex, pageSize });
  }

  @Post()
  @Permission(PermissionSubject.RESOURCE, PermissionAction.CREATE)
  create(@Body() dto: CreateResourceDto) {
    return this.resourceService.create({
      ...dto,
      actions: dto.actions.join(','),
    });
  }

  @Patch(':id')
  @Permission(PermissionSubject.RESOURCE, PermissionAction.UPDATE)
  update(
    @Body() dto: UpdateResourceDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.resourceService.update({
      ...dto,
      id,
    });
  }

  @Delete(':id')
  @Permission(PermissionSubject.RESOURCE, PermissionAction.DELETE)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.resourceService.delete(id);
  }
}
