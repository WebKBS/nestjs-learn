import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Posts } from '../posts/posts.entity';

@Entity()
export class MetaOptions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  metaValue: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @OneToOne(() => Posts, (post) => post.metaOptions, {
    onDelete: 'CASCADE', // post 삭제 시 metaOptions도 같이 삭제
  })
  @JoinColumn()
  posts: Posts;
}
