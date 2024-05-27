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
} from '@nestjs/common';

import { RoleService } from './role.service';
import { AssignPermissionsDto, CreateRoleDto, UpdateRoleDto } from './role.dto';
import {
  PermissionAction,
  PermissionSubject,
} from '@lib/common/enums/permission.enum';
import { Permission } from '../auth/decorators/permission.decorator';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Permission(PermissionSubject.ROLE, PermissionAction.READ)
  find(
    @Query('pageIndex', new DefaultValuePipe(1)) pageIndex: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.roleService.paginate({ pageIndex, pageSize });
  }

  @Post()
  @Permission(PermissionSubject.ROLE, PermissionAction.CREATE)
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Patch(':id')
  @Permission(PermissionSubject.ROLE, PermissionAction.UPDATE)
  update(@Body() dto: UpdateRoleDto, @Param('id', ParseIntPipe) id: number) {
    return this.roleService.update({
      ...dto,
      id,
    });
  }

  @Put(':id/permission')
  @Permission(PermissionSubject.ROLE, PermissionAction.UPDATE)
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
  @Permission(PermissionSubject.ROLE, PermissionAction.DELETE)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete(id);
  }

  @Get(':id')
  @Permission(PermissionSubject.ROLE, PermissionAction.READ)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }
}
