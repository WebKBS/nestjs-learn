import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PatchPostDto } from './dto/patch-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { ActiveUser } from '../auth/decorator/active-user.decorator';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

@Controller('posts')
@ApiTags('게시글 API')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':userId?')
  getPosts(@Param('userId') userId: string, @Query() postQuery: GetPostsDto) {
    console.log(postQuery);
    return this.postsService.findAll(postQuery, userId);
  }

  @ApiOperation({ summary: '게시글 생성' }) // Swagger 문서에 표시되는 요약
  @ApiResponse({ status: 201, description: '게시글 생성 성공' }) // Swagger 문서에 표시되는 응답 상태 코드
  @Post()
  // @Auth(AuthType.None)
  createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    console.log(user);
    //return this.postsService.create(createPostDto);
  }

  @ApiOperation({ summary: '게시글 업데이트' }) // Swagger 문서에 표시되는 요약
  @ApiResponse({ status: 200, description: '게시글 업데이트 성공' }) // Swagger 문서에 표시되는 응답 상태 코드
  @Patch()
  updatePost(@Body() updatePostDto: PatchPostDto) {
    return this.postsService.update(updatePostDto);
  }

  @ApiOperation({ summary: '게시글 삭제' }) // Swagger 문서에 표시되는 요약
  @ApiResponse({ status: 200, description: '게시글 삭제 성공' }) // Swagger 문서에 표시되는 응답 상태 코드
  @Delete()
  deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
