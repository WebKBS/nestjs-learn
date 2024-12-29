import { CreateUserDto } from './create-user.dto';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManyUsersDto {
  @ApiProperty({
    description: '사용자 생성 DTO 배열',
    type: CreateUserDto,
    isArray: true,
    required: true,
    items: {
      type: 'User',
    },
  })
  // 사용자 생성 DTO
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true }) // 배열의 각 요소에 대해 유효성 검사
  @Type(() => CreateUserDto) // Type() 데코레이터를 사용하여 CreateUserDto 클래스를 지정
  users: CreateUserDto[]; // 사용자 생성 DTO 배열
}
