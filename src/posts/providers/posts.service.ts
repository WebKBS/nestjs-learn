import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  findAll(userId: string) {
    return `이 작업은 사용자의 모든 게시물을 반환합니다. ${userId}`;
  }
}
