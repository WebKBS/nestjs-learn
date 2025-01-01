import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dto/signIn.dto';
import { AuthType } from './enums/auth-type.enum';
import { Auth } from './decorator/auth.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @Auth(AuthType.None) // AuthType.None 에 대한 인증을 거치지 않음
  @HttpCode(HttpStatus.OK) // 사용하는 이유는 200 OK 상태 코드를 반환하기 위함입니다.
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Post('refresh-token')
  @Auth(AuthType.None) // AuthType.Refresh 에 대한 인증을 거침
  @HttpCode(HttpStatus.OK) // 사용하는 이유는 200 OK 상태 코드를 반환하기 위함입니다.
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto);
  }
}
