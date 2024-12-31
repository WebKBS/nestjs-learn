import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from '../../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../../constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer; // AuthType.Bearer 를 기본값으로 설정

  // AuthType.Bearer 에 대한 AccessTokenGuard 를 사용하도록 설정
  // AuthType.None 에 대한 canActivate() 는 항상 true 를 반환 => 인증을 거치지 않음
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector, // Reflector 는 메타데이터를 가져오기 위한 클래스

    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // AuthTypes from reflector => 메타데이터에서 AuthType 가져오기
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    //  authTypes 에 따른 guard 가져오기
    const guards = authTypes
      .map((type: number) => this.authTypeGuardMap[type])
      .flat();

    const error = new UnauthorizedException('인증되지 않은 사용자입니다.');

    // array of guards => 여러 개의 guard 를 사용할 수 있도록 설정
    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        console.error(err);
        throw error;
      });

      if (canActivate) {
        return true;
      }
    }

    // loop guards canActivate() => 모든 guard 의 canActivate() 를 실행하고 하나라도 false 가 나오면 false 반환

    throw error;
  }
}
