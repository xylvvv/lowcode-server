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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ResourceService } from './resource.service';
import { CreateResourceDto, UpdateResourceDto } from './resource.dto';

@Controller('resource')
@UseGuards(AuthGuard('jwt'))
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  find(
    @Query('pageIndex', new DefaultValuePipe(1)) pageIndex: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
  ) {
    return this.resourceService.paginate({ pageIndex, pageSize });
  }

  @Post()
  create(@Body() dto: CreateResourceDto) {
    return this.resourceService.create({
      ...dto,
      actions: dto.actions.join(','),
    });
  }

  @Patch(':id')
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
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.resourceService.delete(id);
  }
}
