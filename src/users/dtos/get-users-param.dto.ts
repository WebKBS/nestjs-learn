import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersParamDto {
  @IsOptional()
  @IsInt({ message: 'id 는 숫자여야 합니다.' })
  @Type(() => Number) // class-transformer 를 사용하여 string -> number 변환
  id?: number;
}
