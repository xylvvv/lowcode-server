import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { IPageInfo } from '@lib/common/types/page-info.type';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    // @InjectEntityManager()
    // private readonly entityManager: EntityManager,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async paginate({ pageIndex, pageSize }: IPageInfo) {
    const [list, total] = await this.roleRepository.findAndCount({
      take: pageSize,
      skip: pageSize * (pageIndex - 1),
      order: {
        id: 'DESC',
      },
    });
    return { list, total };
  }

  async create(role: Partial<Role>) {
    const entity = this.roleRepository.create(role);
    // save会先查（根据主键）再执行（更新或创建）返回的是实体；insert只执行创建，返回的是执行结果
    const res = await this.roleRepository.insert(entity);
    return !!res;
  }

  async delete(...ids: number[]) {
    const { affected } = await this.roleRepository.delete(ids);
    return affected === ids.length;
  }

  async update(id: number, role: Partial<Role>) {
    const { affected } = await this.roleRepository.update(id, role);
    return affected === 1;
  }

  // 只有开启了cascades，才能在一次save调用中修改关联关系
  async assignPermissions(id: number, permissions: Permission[] = []) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(Role, {
        id,
        permissions: [],
      });
      if (permissions.length) {
        await queryRunner.manager.save(Role, {
          id,
          permissions,
        });
      }
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  findUnique({ id, name }: { id?: number; name?: string }) {
    return this.roleRepository.findOneBy({ name, id });
  }

  findOne(id: number) {
    return this.roleRepository.findOne({
      where: { id },
      relations: {
        permissions: {
          resource: true,
        },
      },
    });
  }
}
