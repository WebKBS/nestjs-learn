import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// PartialType 을 사용하여 CreateUserDto 의 필수 속성을 선택 속성으로 변경
export class PatchUserDto extends PartialType(CreateUserDto) {}
