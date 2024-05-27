import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '资源名称', unique: true })
  subject: string;

  @Column({ comment: '资源描述', nullable: true })
  description?: string;

  @Column({
    comment: '允许配置的操作策略',
    // default: 'create,read,update,delete,manage',
  })
  actions: string;

  @CreateDateColumn({ name: 'create_at', nullable: true })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at', nullable: true })
  updateAt: Date;
}
