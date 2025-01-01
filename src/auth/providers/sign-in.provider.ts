import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dto/signIn.dto';
import { UsersService } from '../../users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    // inject GenerateTokensProvider
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // 사용자의 email 을 이용하여 사용자를 찾는다.
    const user = await this.usersService.findOneByEmail(signInDto.email);

    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: '비밀번호를 확인하는 도중 오류가 발생했습니다.',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    // Generate access token and refresh token
    return await this.generateTokensProvider.generateTokens(user);
  }
}
