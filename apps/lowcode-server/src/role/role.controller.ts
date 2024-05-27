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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { RoleService } from './role.service';
import { AssignPermissionsDto, CreateRoleDto, UpdateRoleDto } from './role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('role')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  find(
    @Query('pageIndex', new DefaultValuePipe(1)) pageIndex: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.roleService.paginate({ pageIndex, pageSize });
  }

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Patch(':id')
  update(@Body() dto: UpdateRoleDto, @Param('id', ParseIntPipe) id: number) {
    return this.roleService.update({
      ...dto,
      id,
    });
  }

  @Put(':id/permission')
  assignPermissions(
    @Body() { permissions = [] }: AssignPermissionsDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.roleService.assignPermissions({
      id,
      permissions: permissions.reduce((acc, crt) => {
        return acc.concat(
          crt.actions.map((action) => ({
            resource: { id: crt.resourceId },
            action,
          })),
        );
      }, []),
    });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }
}
