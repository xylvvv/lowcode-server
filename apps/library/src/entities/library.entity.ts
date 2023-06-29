import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { LibraryVersion } from './library-version.entity';

@Entity()
export class Library {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '组件库名称',
    unique: true,
  })
  name: string;

  @Column({ comment: '组件库标题', nullable: true })
  title: string;

  @JoinColumn({ name: 'current_version' })
  @OneToOne(() => LibraryVersion, {
    cascade: true,
  })
  currentVersion: LibraryVersion;

  @Column({ comment: '是否公开', default: false, name: 'is_public' })
  isPublic: boolean;

  @Index()
  @Column({ comment: '所属用户' })
  author: string;

  @CreateDateColumn({ name: 'create_at', nullable: true })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at', nullable: true })
  updateAt: Date;
}
