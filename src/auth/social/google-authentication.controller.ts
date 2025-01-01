import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { GoogleTokenDto } from './dto/google-token.dto';
import { Auth } from '../decorator/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  public async authentication(@Body() googleTokenDto: GoogleTokenDto) {
    return await this.googleAuthenticationService.authentication(
      googleTokenDto,
    );
  }
}
