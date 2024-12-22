import { CreatePostDto } from './create-post.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PatchPostDto extends PartialType(CreatePostDto) {
  // PartialType 을 사용하면 CreatePostDto 의 필드 중 일부만 선택적으로 사용할 수 있게 된다.
  // 이를 통해 일부 필드만 업데이트할 수 있게 된다.
  // PartialType 을 가져오려면 반드시 "@nestjs/swagger" 에서 가져와야 한다.

  @ApiProperty({
    description: '게시글 id',
  })
  @IsInt({ message: 'id 는 숫자여야 합니다.' })
  @IsNotEmpty()
  id: number;
}
