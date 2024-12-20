import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';

@Controller('users')
export class UsersController {
  @Get('/:id?') // GET /users/:id (optional) - 물음표를 붙이면 id가 있어도 없어도 됨
  getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, // limit 없으면 10으로 기본값 설정
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, // page 없으면 1로 기본값 설정
  ): string {
    console.log(getUsersParamDto);
    console.log(limit);
    console.log(page);

    return `id: ${getUsersParamDto.id}, limit: ${limit}, page: ${page}`;
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    // ValidationPipe 를 사용하면 request 에 대한 유효성 검사를 자동으로 수행
    console.log(createUserDto);
    return 'User 생성되었습니다.';
  }

  @Patch()
  patchUser(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
    return 'User 수정되었습니다.';
  }
}
