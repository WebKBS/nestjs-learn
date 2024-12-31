import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { MetaOptions } from '../meta-options/meta-options.entity';
import { TagsModule } from '../tags/tags.module';
import { PaginationModule } from '../common/pagination/pagination.module';
import { CreatePostProvider } from './providers/create-post.provider';

@Module({
  controllers: [PostsController],
  providers: [PostsService, CreatePostProvider],
  imports: [
    UsersModule,
    TagsModule,
    TypeOrmModule.forFeature([Posts, MetaOptions]),
    PaginationModule,
  ], // UsersModule 을 import 합니다.
})
export class PostsModule {}
