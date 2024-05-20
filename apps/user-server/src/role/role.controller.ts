import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { RoleService } from './role.service';
import { IPageInfo } from '@lib/common/types/page-info.type';
import { BusinessException } from '@lib/common/exceptions/business.exception';
import { MicroServiceType } from '@lib/common/types/micro-service.type';
import { Role } from './role.entity';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { Permission } from './permission.entity';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  private readonly logger = new Logger(RoleController.name);

  @GrpcMethod('RoleService', 'Paginate')
  async paginate(pageInfo: IPageInfo) {
    try {
      return await this.roleService.paginate(pageInfo);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException('角色列表查询失败');
    }
  }

  @GrpcMethod('RoleService', 'Create')
  async create(role: Partial<Role>) {
    const exist = await this.roleService.findUnique({ name: role.name });
    if (exist) {
      throw new BusinessException(ERRNO_ENUM.ROLE_EXISTED, '该角色已存在');
    }
    try {
      return await this.roleService.create(role);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException('角色创建失败');
    }
  }

  @GrpcMethod('RoleService', 'Update')
  async update({ id, ...role }: Partial<Role>) {
    if (role.name) {
      const data = await this.roleService.findUnique({ name: role.name });
      if (data && data.id !== id) {
        throw new BusinessException(ERRNO_ENUM.ROLE_EXISTED, '该角色已存在');
      }
    }
    try {
      return await this.roleService.update(id, role);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException('角色更新失败');
    }
  }

  @GrpcMethod('RoleService', 'AssignPermissions')
  async assignPermissions({
    id,
    permissions,
  }: Pick<Role, 'id' | 'permissions'>) {
    const role = await this.roleService.findUnique({ id });
    if (!role)
      throw new BusinessException(ERRNO_ENUM.ROLE_FIND_FAILED, '角色不存在');
    try {
      return await this.roleService.assignPermissions(id, permissions);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException('权限分配失败');
    }
  }

  @GrpcMethod('RoleService', 'Delete')
  async delete({ id }: { id: number }) {
    try {
      return await this.roleService.delete(id);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException('角色删除失败');
    }
  }

  @GrpcMethod('RoleService', 'FindOne')
  async findOne({ id }: { id: number }) {
    try {
      return await this.roleService.findOne(id);
    } catch (error) {
      throw new BusinessException('角色查询失败');
    }
  }

  comparePermission(p1: Permission, p2: Permission) {
    return p1.resource.id === p2.resource.id && p1.action === p2.action;
  }
}

export type IRoleMicroService = MicroServiceType<typeof RoleController>;
