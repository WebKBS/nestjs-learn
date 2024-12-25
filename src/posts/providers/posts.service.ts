import { Body, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { Repository } from 'typeorm';
import { Posts } from '../posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from '../../tags/providers/tags.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    // TypeORM Repository를 주입합니다.
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    // @InjectRepository(MetaOptions)
    // private metaOptionsRepository: Repository<MetaOptions>,

    private tagsService: TagsService,
  ) {}

  async create(@Body() createPostDto: CreatePostDto) {
    //userId를 기반으로 데이터베이스에서 작성자 찾기
    let author = await this.usersService.findOneById(createPostDto.authorId);

    // tags를 기반으로 데이터베이스에서 태그 찾기
    let tags = await this.tagsService.findMultipleTags(createPostDto.tags);

    // 작성자가 없으면 에러 발생
    if (!author) {
      throw new Error('작성자를 찾을 수 없습니다.');
    }

    // post 생성 - cascade 설정으로 metaOptions 도 같이 생성된다
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    return await this.postsRepository.save(post);
  }

  async findAll(userId: string) {
    return await this.postsRepository.find({
      // relations: ['author', 'metaOptions', 'tags'], // author, metaOptions, tags를 가져온다
    });
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
