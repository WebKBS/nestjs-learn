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
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersParamDto } from './dto/get-users-param.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { UsersService } from './providers/users.service';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateManyUsersDto } from './dto/create-many-users.dto';

@Controller('users')
@ApiTags('사용자 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id?') // GET /users/:id (optional) - 물음표를 붙이면 id가 있어도 없어도 됨
  @ApiOperation({ summary: '사용자 조회' }) // Swagger 문서에 api summary 표시
  @ApiResponse({
    // Swagger 문서에 응답에 대한 정보 표시
    status: 200, // 응답 상태 코드
    description: '성공', // 응답 상태 코드에 대한 설명
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiQuery({
    // Swagger 문서에 query string 을 표시
    name: 'limit', // query string 이름
    required: false, // 필수 여부
    type: 'number', // 데이터 타입
    description: '한번에 가져올 데이터의 개수', // 설명
    example: 10, // 예시
  })
  @ApiQuery({
    name: 'page', // query string 이름
    required: false, // 필수 여부
    type: 'number', // 데이터 타입
    description: '가져올 페이지 번호', // 설명
    example: 1, // 예시 - 기본 값
  })
  getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, // limit 없으면 10으로 기본값 설정
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, // page 없으면 1로 기본값 설정
  ) {
    return this.usersService.findAll(getUsersParamDto, limit, page);
  }

  @Post()
  @ApiOperation({ summary: '사용자 생성' })
  @ApiResponse({
    status: 201,
    description: '성공',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: '홍길동' },
        age: { type: 'number', example: 28 },
        email: { type: 'string', example: 'asd' },
      },
    },
  })
  createUsers(@Body() createUserDto: CreateUserDto) {
    // ValidationPipe 를 사용하면 request 에 대한 유효성 검사를 자동으로 수행

    return this.usersService.createUser(createUserDto); // 사용자 생성
  }

  @Post('create-many')
  @ApiOperation({ summary: '여러 사용자 생성' })
  @ApiResponse({
    status: 201,
    description: '성공',
  })
  createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    return this.usersService.createMany(createManyUsersDto); // 여러 사용자 생성
  }

  @Patch()
  patchUser(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
    return 'User 수정되었습니다.';
  }
}
