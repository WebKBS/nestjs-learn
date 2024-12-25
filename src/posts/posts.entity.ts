import { PostType } from './enums/postType.enum';
import { PostStatus } from './enums/postStatus.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MetaOptions } from '../meta-options/meta-options.entity';
import { Users } from '../users/user.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: PostType,
    nullable: false,
    default: PostType.POST,
  })
  postType: PostType;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    nullable: false,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishOn?: Date;

  @ManyToOne(() => Users, (user) => user.posts)
  author: Users;

  tags?: string[];

  @OneToOne(() => MetaOptions, (metaOptions) => metaOptions.posts, {
    cascade: true, // MetaOptions 엔티티와 함께 저장 및 업데이트
    eager: true, // Posts 엔티티를 가져올 때 MetaOptions 엔티티도 함께 가져온다.
  }) // MetaOptions 엔티티와 일대일 관계 설정
  // @JoinColumn() // JoinColumn 데코레이터는 외래 키를 지정한다.
  metaOptions: MetaOptions;
}
