import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  getUsers(): string {
    return 'This action returns all users';
  }

  @Post()
  createUser(): string {
    return 'User가 생성되었습니다.';
  }
}
