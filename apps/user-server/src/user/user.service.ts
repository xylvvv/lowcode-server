import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { IPageInfo } from '@lib/common/types/page-info.type';
import { Role } from '../role/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>) {
    const entity = this.userRepository.create(user);
    const res = await this.userRepository.insert(entity);
    return !!res;
  }

  async findOne(username: string) {
    const res = await this.userRepository.findOne({
      where: { username },
      relations: {
        roles: {
          permissions: {
            resource: true,
          },
        },
      },
    });
    return res;
  }

  findUnique({ username }: { username?: string }) {
    return this.userRepository.findOneBy({ username });
  }

  async paginate({ pageIndex, pageSize }: IPageInfo) {
    const [list, total] = await this.userRepository.findAndCount({
      take: pageSize,
      skip: pageSize * (pageIndex - 1),
      order: {
        id: 'DESC',
      },
      relations: {
        roles: true,
      },
    });
    return { list, total };
  }

  async delete(...ids: number[]) {
    const { affected } = await this.userRepository.delete(ids);
    return affected === ids.length;
  }

  async update(id: number, role: Partial<User>) {
    const { affected } = await this.userRepository.update(id, role);
    return affected === 1;
  }

  assignRoles(id: number, roles: Partial<Role>[]) {
    return this.userRepository.save({
      id,
      roles,
    });
  }
}
