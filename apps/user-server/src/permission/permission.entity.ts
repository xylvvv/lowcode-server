import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '主题', unique: true })
  subject: string;

  @Column({ comment: '可对主题执行的行为' })
  action: string;

  @Column({ comment: '行为可执行的条件', nullable: true, type: 'json' })
  conditions?: string;

  @CreateDateColumn({ name: 'create_at', nullable: true })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at', nullable: true })
  updateAt: Date;
}
