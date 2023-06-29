import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { LibraryVersion } from './library-version.entity';

@Unique('library_author', ['library', 'author'])
@Entity('library_config')
export class LibraryConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '组件库名称' })
  library: string;

  @Column({ comment: '作者' })
  author: string;

  @JoinColumn({ name: 'current_version' })
  @OneToOne(() => LibraryVersion, { cascade: true })
  currentVersion: LibraryVersion;

  @Column({ comment: '标题' })
  title: string;
}
