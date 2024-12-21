import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth/auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [forwardRef(() => UsersModule)], // forwardRef() 함수를 사용하여 순환 참조를 해결합니다.
  exports: [AuthService],
})
export class AuthModule {}
