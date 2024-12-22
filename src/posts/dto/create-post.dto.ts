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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: '게시글 제목', // Swagger 문서에 표시되는 예시 - 기본 값
    description: '게시글 제목을 입력해주세요.', // Swagger 문서에 표시되는 설명
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: PostType,
    description: 'enum: post, page, story, series',
  })
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  @ApiProperty({
    example: '게시글-slug',
    description: '게시글의 slug, ex) my-post-title',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug 형식이 올바르지 않습니다.',
  }) // slug 형식 검증
  slug: string;

  @ApiProperty({
    enum: PostStatus,
    description: 'enum: draft, scheduled, review, published',
  })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  @ApiPropertyOptional({
    description: '게시글 내용',
    example: '게시글 내용을 입력해주세요.',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: '스키마는 JSON 형식으로 입력해주세요.',
    example:
      '{\r\n "@context": "https:\/\/schema.org",\r\n "@type": "Person"\r\n  }',
  })
  @IsJSON()
  @IsOptional()
  schema?: string;

  @ApiPropertyOptional({
    description: '게시글의 대표 이미지 URL',
    example: 'https://example.com/featured-image.jpg',
  })
  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: '게시글의 발행일',
    example: '2021-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: '게시글의 태그는 배열(string) 형식으로 입력해주세요.',
    example: ['tag1', 'tag2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // each 옵션을 사용하여 배열의 각 요소가 string 타입인지 검증
  @MinLength(3, { each: true }) // each 옵션을 사용하여 배열의 각 요소의 최소 길이 검증
  tags?: string[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: '메타 키',
          example: 'sidebarEnabled',
        },
        value: {
          type: 'string',
          description: '메타 값',
          example: 'true',
        },
      },
    },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // each 옵션을 사용하여 배열의 각 요소가 객체인지 검증
  @Type(() => CreatePostMetaOptionsDto) // class-transformer 를 사용하여 객체로 변환
  metaOptions: CreatePostMetaOptionsDto[];
}
