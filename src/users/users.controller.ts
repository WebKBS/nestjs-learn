import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id?') // GET /users/:id (optional) - 물음표를 붙이면 id가 있어도 없어도 됨
  getUsers(
    @Param('id', ParseIntPipe) id: number | undefined,
    @Query('limit') limit: string,
  ): string {
    console.log(id, limit);
    return `User ${id || ''}의 정보를 가져옵니다. ${limit || ''}`;
  }

  @Post()
  createUser(@Body() request: any): string {
    console.log(request);
    return 'User 생성되었습니다.';
  }
}
