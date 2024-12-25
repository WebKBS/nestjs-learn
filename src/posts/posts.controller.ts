import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PatchPostDto } from './dto/patch-post.dto';

@Controller('posts')
@ApiTags('게시글 API')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':userId?')
  getPosts(@Param('userId') userId: string) {
    return this.postsService.findAll(userId);
  }

  @ApiOperation({ summary: '게시글 생성' }) // Swagger 문서에 표시되는 요약
  @ApiResponse({ status: 201, description: '게시글 생성 성공' }) // Swagger 문서에 표시되는 응답 상태 코드
  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @ApiOperation({ summary: '게시글 업데이트' }) // Swagger 문서에 표시되는 요약
  @ApiResponse({ status: 200, description: '게시글 업데이트 성공' }) // Swagger 문서에 표시되는 응답 상태 코드
  @Patch(':id')
  updatePost(@Param('id') id: string, @Body() updatePostDto: PatchPostDto) {
    console.log(id, updatePostDto);
  }
}
