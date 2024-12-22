import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
@ApiTags('게시글 API')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':userId?')
  getPosts(@Param('userId') userId: string) {
    return this.postsService.findAll(userId);
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
  }
}
