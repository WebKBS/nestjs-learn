import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersParamDto {
  @ApiPropertyOptional({
    description: '사용자 id', // Swagger 문서에 표시되는 설명
    example: 1, // Swagger 문서에 표시되는 예시 - 기본 값
  })
  @IsOptional()
  @IsInt({ message: 'id 는 숫자여야 합니다.' })
  @Type(() => Number) // class-transformer 를 사용하여 string -> number 변환
  id?: number;
}
