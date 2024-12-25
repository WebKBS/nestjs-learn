import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { MetaOptions } from '../meta-options/meta-options.entity';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [UsersModule, TypeOrmModule.forFeature([Posts, MetaOptions])], // UsersModule 을 import 합니다.
})
export class PostsModule {}
