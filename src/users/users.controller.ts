import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id?') // GET /users/:id (optional) - 물음표를 붙이면 id가 있어도 없어도 됨
  getUsers(@Param('id') id: string): string {
    return id ? `User ${id} 조회되었습니다.` : 'User 전체 조회되었습니다.';
  }

  @Post()
  createUser(): string {
    return 'User 생성되었습니다.';
  }
}
