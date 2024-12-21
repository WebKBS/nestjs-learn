import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 다른 모듈에서 UsersService 를 사용할 수 있도록 내보냅니다.
  imports: [forwardRef(() => AuthModule)], // AuthModule 을 가져와서 사용합니다.
})
export class UsersModule {}
