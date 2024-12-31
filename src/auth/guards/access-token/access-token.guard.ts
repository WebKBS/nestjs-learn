import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../../constants/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    // inject jwt service
    private readonly jwtService: JwtService,
    // inject jwt config
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 컨텍스트에서 요청 객체 추출
    const request = context.switchToHttp().getRequest();

    // 헤더에서 토큰을 추출합니다.
    const token = this.extractRequestFromHeader(request);

    // 토큰 유효성 검사
    if (!token) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    try {
      // 토큰을 검증하고 페이로드를 추출합니다.
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;

      console.log('payload', payload);
    } catch {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }

    return true;
  }

  // 헤더에서 토큰 추출 함수
  private extractRequestFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
