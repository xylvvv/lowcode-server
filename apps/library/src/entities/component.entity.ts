import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LibraryVersion } from './library-version.entity';

@Entity()
export class Component {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '组件名称' })
  name: string;

  @Column({ comment: '远程组件路径' })
  path: string;

  @Column({ comment: '远程组件prop配置文件路径', name: 'setting_path' })
  settingPath: string;

  @Column({ comment: '远程组件详细信息文件路径', name: 'detail_path' })
  detailPath: string;

  @JoinColumn({ name: 'library_version_id' })
  @ManyToOne(() => LibraryVersion, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  version: LibraryVersion;
}
