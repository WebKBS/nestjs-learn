import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { Repository } from 'typeorm';
import { Posts } from '../posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from '../../tags/providers/tags.service';
import { PatchPostDto } from '../dto/patch-post.dto';
import { GetPostsDto } from '../dto/get-posts.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    // TypeORM Repository를 주입합니다.
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    // @InjectRepository(MetaOptions)
    // private metaOptionsRepository: Repository<MetaOptions>,

    private readonly tagsService: TagsService,
  ) {}

  async create(createPostDto: CreatePostDto) {
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

  async findAll(postQuery: GetPostsDto, userId: string) {
    return await this.postsRepository.find({
      // relations: ['author', 'metaOptions', 'tags'], // author, metaOptions, tags를 가져온다
      take: postQuery.limit, // take 는 데이터를 가져올 개수
      skip: postQuery.page * postQuery.limit, // skip 은 데이터를 건너뛸 개수
    });
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags = undefined;
    let post = undefined;

    // tags 찾기
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    } catch (error) {
      throw new RequestTimeoutException('요청 시간이 초과되었습니다.');
    }

    if (!tags || tags.length !== patchPostDto.tags.length) {
      throw new BadRequestException('태그를 찾을 수 없습니다.');
    }

    // post 찾기
    try {
      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException('요청 시간이 초과되었습니다.');
    }

    if (!post) {
      throw new BadRequestException('포스트를 찾을 수 없습니다.');
    }

    // post 업데이트
    post.title = patchPostDto.title ?? post.title; // {...post, ...patchPostDto} 를 사용하면 undefined 값이 들어가게 된다.
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // new tags 추가
    post.tags = tags;

    // post 저장
    try {
      post = await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException('요청 시간이 초과되었습니다.');
    }

    return post;
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
