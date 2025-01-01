import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SignInDto } from '../dto/signIn.dto';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RefreshTokenProvider } from './refresh-token.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly signInProvider: SignInProvider,
    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokenProvider.refreshToken(refreshTokenDto);
  }
}
