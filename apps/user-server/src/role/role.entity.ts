import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from '../permission/permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '角色名称', unique: true })
  name: string;

  @Column({ comment: '角色描述', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'create_at', nullable: true })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at', nullable: true })
  updateAt: Date;

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'role_permission' })
  permissions: Permission[];
}
