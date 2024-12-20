import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  @Get('/:id?') // GET /users/:id (optional) - 물음표를 붙이면 id가 있어도 없어도 됨
  getUsers(
    @Param('id', ParseIntPipe) id: number | undefined,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, // limit 없으면 10으로 기본값 설정
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, // page 없으면 1로 기본값 설정
  ): string {
    console.log(id, limit, page);

    return `User ${id || ''}의 정보를 가져옵니다. ${limit || ''}`;
  }

  @Post()
  createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    // ValidationPipe 를 사용하면 request 에 대한 유효성 검사를 자동으로 수행
    console.log(createUserDto);
    return 'User 생성되었습니다.';
  }
}
