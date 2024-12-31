import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from '../posts.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/providers/users.service';
import { TagsService } from '../../tags/providers/tags.service';
import { ActiveUserData } from '../../auth/interfaces/active-user-data.interface';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    private readonly tagsService: TagsService,
  ) {}

  async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author = undefined;
    let tags = undefined;

    try {
      //userId 를 기반으로 데이터베이스에서 작성자 찾기
      author = await this.usersService.findOneById(user.sub);

      // tags 를 기반으로 데이터베이스에서 태그 찾기
      tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    } catch (error) {
      throw new ConflictException('작성자 또는 태그를 찾을 수 없습니다.');
    }

    if (!tags || tags.length !== createPostDto.tags.length) {
      throw new ConflictException('태그를 찾을 수 없습니다.');
    }

    // 작성자가 없으면 에러 발생
    if (!author) {
      throw new ConflictException('작성자를 찾을 수 없습니다.');
    }

    // post 생성 - cascade 설정으로 metaOptions 도 같이 생성된다
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException('게시글을 생성할 수 없습니다.');
    }
  }
}
