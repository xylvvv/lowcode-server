import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

enum Gender {
  MAN = 1,
  WOMAN = 2,
  UNKNOWN = 0,
}

// @Unique(['username', 'phone'])
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户名', unique: true })
  username: string;

  @Column({ comment: '密码' })
  password: string;

  @Column({ comment: '手机号', unique: true })
  phone: string;

  @Column({ comment: '昵称', nullable: true })
  nickname: string;

  @Column({
    comment: '性别（1 男性，2 女性，0 保密）',
    default: Gender.UNKNOWN,
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({ comment: '头像，图片地址', nullable: true })
  picture: string;

  @Column({ name: 'latest_login_at', comment: '最后登录时间', nullable: true })
  latestLoginAt: Date;

  @Column({ name: 'is_frozen', comment: '用户是否冻结', default: false })
  isFrozen: boolean;

  @CreateDateColumn({ name: 'create_at', nullable: true })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at', nullable: true })
  updateAt: Date;
}
