import { WORK_STATUS_ENUM } from '@lib/common/enums/work-status.enum';
import {
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 6,
    unique: true,
    comment: 'uuid，h5 url 中使用，隐藏真正的 id，避免被爬虫',
  })
  // @Generated('uuid')
  uuid: string;

  @Column({ comment: '标题' })
  title: string;

  @Column({ comment: '副标题', nullable: true })
  subtitle: string;

  @Column({ name: 'content_id', unique: true, comment: '内容id' })
  contentId: string;

  @Column({
    name: 'publish_content_id',
    unique: true,
    comment: '发布内容id，未发布时为空',
    nullable: true,
  })
  publishContentId: string;

  @Column({ comment: '作者username' })
  author: string;

  @Column({ name: 'cover_img', comment: '封面图片url', nullable: true })
  coverImg: string;

  @Column({ name: 'is_template', default: false, comment: '是否为模版' })
  isTemplate: boolean;

  @Column({
    default: WORK_STATUS_ENUM.UNPUBLISH,
    type: 'enum',
    enum: WORK_STATUS_ENUM,
    comment: '状态：0-删除，1-未发布，2-发布，3-强制下线',
  })
  status: WORK_STATUS_ENUM;

  @Column({ name: 'copied_count', default: 0, comment: '被复制次数' })
  copiedCount: number;

  @Column({
    name: 'latest_publish_at',
    nullable: true,
    comment: '最后一次发布时间',
  })
  latestPublishAt: Date;

  @Column({ name: 'is_hot', default: false, comment: 'hot 标签，模版使用' })
  isHot: boolean;

  @Column({ name: 'is_new', default: false, comment: 'new 标签，模版使用' })
  isNew: boolean;

  @Column({ default: 0, comment: '排序参数' })
  sort: number;

  @Column({
    name: 'is_public',
    default: false,
    comment: '是否公开显示在首页公共的模版列表',
  })
  isPublic: boolean;

  @CreateDateColumn({ name: 'create_at', nullable: true })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at', nullable: true })
  updateAt: Date;

  @BeforeInsert()
  setUUID() {
    this.uuid = uuid().slice(0, 6);
  }
}
