import {
  Controller,
  Body,
  Get,
  Query,
  DefaultValuePipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';

import { User as UserEntity } from 'apps/user-server/src/user/user.entity';
import { UserService } from '../user.service';
import { UpdateUserDto } from '../dtos/user.dto';
import { Role } from 'apps/user-server/src/role/role.entity';
import { Permission } from '../../auth/decorators/permission.decorator';
import {
  PermissionAction,
  PermissionSubject,
} from '@lib/common/enums/permission.enum';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @Permission(PermissionSubject.USER, PermissionAction.READ)
  async find(
    @Query('pageIndex', new DefaultValuePipe(1)) pageIndex: number,
    @Query('pageSize') pageSize: number,
  ) {
    const { list = [], total } = await this.userService.paginate({
      pageIndex,
      pageSize,
    });
    return {
      list: list.map((user) => new UserEntity(user)),
      total,
    };
  }

  @Delete(':id')
  @Permission(PermissionSubject.USER, PermissionAction.DELETE)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }

  @Patch(':id')
  @Permission(PermissionSubject.USER, PermissionAction.UPDATE)
  update(@Body() dto: UpdateUserDto, @Param('id', ParseIntPipe) id: number) {
    const { roles, ...user } = dto;
    return this.userService.update({
      ...user,
      id,
      roles: roles?.map((role) => ({ id: role } as Role)),
      assignRoles: Array.isArray(roles),
    });
  }
}
