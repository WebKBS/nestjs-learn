import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 다른 모듈에서 UsersService 를 사용할 수 있도록 내보냅니다.
})
export class UsersModule {}
