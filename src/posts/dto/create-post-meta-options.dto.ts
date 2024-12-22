import {IsNotEmpty, IsString} from 'class-validator';

/**
 * 게시물 메타 옵션 생성 DTO
 */
export class CreatePostMetaOptionsDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: any;
}
