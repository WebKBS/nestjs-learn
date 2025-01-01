import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';
import { GoogleTokenDto } from '../dto/google-token.dto';
import { UsersService } from '../../../users/providers/users.service';
import { GenerateTokensProvider } from '../../providers/generate-tokens.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauth2Client: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    // inject users service
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    // inject generate token provider
    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}

  async onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;

    this.oauth2Client = new OAuth2Client(clientId, clientSecret);
  }

  public async authentication(googleTokenDto: GoogleTokenDto) {
    try {
      // 사용자가 보낸 Google 토큰 확인
      const loginTicket = await this.oauth2Client.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      // Google jwt 에서 페이로드 추출
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = loginTicket.getPayload();

      // Google ID 로 사용자 조회
      const user = await this.usersService.findOneByGoogleId(googleId);

      if (user) {
        // 사용자가 존재하면 토큰 발급
        return await this.generateTokenProvider.generateTokens(user);
      }

      // 사용자가 존재하지 않으면 사용자 생성
      const newUser = await this.usersService.createGoogleUser({
        email,
        googleId,
        firstName,
        lastName,
      });

      // 사용자 생성 후 토큰 발급
      return await this.generateTokenProvider.generateTokens(newUser);
    } catch (error) {
      throw new UnauthorizedException(error, {
        description: '잘못된 토큰입니다.',
      });
    }
  }
}
