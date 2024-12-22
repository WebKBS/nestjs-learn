import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '이름은 필수 입력 사항입니다.' })
  @MinLength(3, { message: '이름은 최소 3자 이상이어야 합니다.' })
  @MaxLength(96, { message: '이름은 최대 96자까지 가능합니다.' })
  firstName: string;

  @IsString({ message: '성은 문자열이어야 합니다.' })
  @IsOptional()
  @MinLength(3, { message: '성은 최소 3자 이상이어야 합니다.' })
  @MaxLength(96, { message: '성은 최대 96자까지 가능합니다.' })
  lastName?: string;

  @IsEmail({}, { message: '이메일 형식이어야 합니다.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 사항입니다.' })
  email: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}/, {
    message: '비밀번호는 최소 1개의 대문자, 소문자, 숫자를 포함해야 합니다.',
  })
  password: string;
}
