import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum Status {
  DELETE = 0,
  NORMAL = 1,
}

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '渠道名称' })
  name: string;

  @Column({ name: 'work_id', comment: '作品id' })
  workId: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.NORMAL,
    comment: '状态：0-删除，1-正常',
  })
  status: Status;
}
