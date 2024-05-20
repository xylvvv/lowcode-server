import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Resource } from '../resource/resource.entity';

@Entity()
export class Permission {
  @ManyToOne(() => Resource, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  // 这个装饰器对于@ManyToOne是可选的，但@OneToOne是必需的
  @JoinColumn({ name: 'resource_id' })
  // 与action联合主键，不然的话只有resourceId和action无主键时，save不会先查找对应的resource
  @PrimaryColumn({ name: 'resource_id' })
  resource: Resource;

  @PrimaryColumn({ comment: '操作策略' })
  action: string;

  @Column({ comment: '操作策略的条件', nullable: true, type: 'json' })
  conditions?: string;

  @CreateDateColumn({ name: 'create_at', nullable: true })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at', nullable: true })
  updateAt: Date;
}
