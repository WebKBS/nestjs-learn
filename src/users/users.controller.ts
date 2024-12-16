import { Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id?') // GET /users/:id (optional) - 물음표를 붙이면 id가 있어도 없어도 됨
  getUsers(@Param('id') id: string, @Query('name') name: string): string {
    return `User ${id || ''}의 정보를 가져옵니다. ${name || ''}`;
  }

  @Post()
  createUser(): string {
    return 'User 생성되었습니다.';
  }
}
