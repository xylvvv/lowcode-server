import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Component } from './component.entity';

@Entity('library_version')
export class LibraryVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '组件库名称' })
  library: string;

  @Column({ comment: '组件库版本号' })
  version: string;

  @OneToMany(() => Component, (component) => component.version, {
    cascade: true,
  })
  components: Component[];
}
