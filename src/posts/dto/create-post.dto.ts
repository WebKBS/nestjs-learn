import { PostType } from '../enums/postType.enum';
import { PostStatus } from '../enums/postStatus.enum';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug 형식이 올바르지 않습니다.',
  }) // slug 형식 검증
  slug: string;

  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  @IsString()
  @IsOptional()
  content?: string;

  @IsJSON()
  @IsOptional()
  schema?: string;

  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;

  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // each 옵션을 사용하여 배열의 각 요소가 string 타입인지 검증
  @MinLength(3, { each: true }) // each 옵션을 사용하여 배열의 각 요소의 최소 길이 검증
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // each 옵션을 사용하여 배열의 각 요소가 객체인지 검증
  @Type(() => CreatePostMetaOptionsDto) // class-transformer 를 사용하여 객체로 변환
  metaOptions: CreatePostMetaOptionsDto[];
}
