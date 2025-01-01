import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Posts } from '../posts/posts.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn() // PrimaryGeneratedColumn 데코레이터는 엔티티의 기본 키를 생성한다.
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  password?: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  googleId?: string;

  @OneToMany(() => Posts, (post) => post.author) // Posts 엔티티와 일대다 관계를 설정한다.
  posts: Posts[];
}
