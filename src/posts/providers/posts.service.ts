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
    // post 생성 - cascade 설정으로 metaOptions 도 같이 생성된다
    let post = this.postsRepository.create(createPostDto);

    return await this.postsRepository.save(post);
  }

  async findAll(userId: string) {
    return await this.postsRepository.find();
  }

  async delete(id: number) {
    // // post 찾기
    await this.postsRepository.delete(id);
    //
    // // post 삭제
    // await this.postsRepository.delete(id);
    //
    // // metaOptions 삭제
    // await this.metaOptionsRepository.delete(post.metaOptions.id);

    return { deleted: true, id: id };
  }
}
