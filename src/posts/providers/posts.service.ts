import { Body, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { Repository } from 'typeorm';
import { Posts } from '../posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOptions } from '../../meta-options/meta-options.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    // TypeORM Repository를 주입합니다.
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    @InjectRepository(MetaOptions)
    private metaOptionsRepository: Repository<MetaOptions>,
  ) {}

  async create(@Body() createPostDto: CreatePostDto) {
    // metaOptions 생성
    let metaOptions = createPostDto.metaOptions
      ? this.metaOptionsRepository.create(createPostDto.metaOptions)
      : null;

    if (metaOptions) {
      await this.metaOptionsRepository.save(metaOptions);
    }

    // post 생성
    let post = this.postsRepository.create(createPostDto);

    if (metaOptions) {
      post.metaOptions = metaOptions;
    }

    return await this.postsRepository.save(post);
  }

  findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    return [
      {
        user: user,
        title: 'Post 1',
        content: 'This is post 1',
      },
      {
        user: user,
        title: 'Post 2',
        content: 'This is post 2',
      },
    ];
  }
}
