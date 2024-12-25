import {IsJSON, IsNotEmpty} from 'class-validator';

/**
 * 게시물 메타 옵션 생성 DTO
 */

export class CreatePostMetaOptionsDto {
  @IsNotEmpty()
  @IsJSON()
  metaValue: string;
}
