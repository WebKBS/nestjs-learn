import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from '../users/users.module';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider, // HashingProvider 프로바이더를 AuthService 에 주입합니다.
      useClass: BcryptProvider, // BcryptProvider 클래스를 HashingProvider 프로바이더로 사용합니다.
    },
    SignInProvider,
  ],
  imports: [
    forwardRef(() => UsersModule), // forwardRef() 함수를 사용하여 순환 참조를 해결합니다.
    ConfigModule.forFeature(jwtConfig), // jwtConfig 를 ConfigModule 에 등록합니다.
    JwtModule.registerAsync(jwtConfig.asProvider()), // jwtConfig 를 JwtModule 에 등록합니다.
  ], // forwardRef() 함수를 사용하여 순환 참조를 해결합니다.
  exports: [AuthService, HashingProvider], // AuthService 와 HashingProvider 를 외부로 노출합니다.
})
export class AuthModule {}
