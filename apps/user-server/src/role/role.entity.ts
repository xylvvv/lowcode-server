import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from './permission.entity';

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

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({
    name: 'role_permission',
    joinColumns: [{ name: 'role_id' }],
    inverseJoinColumns: [
      {
        referencedColumnName: 'resource',
        name: 'permission_resource_id',
      },
      {
        referencedColumnName: 'action',
        name: 'permission_action',
      },
    ],
  })
  permissions: Permission[];
}
