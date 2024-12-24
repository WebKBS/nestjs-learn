import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 다른 모듈에서 UsersService 를 사용할 수 있도록 내보냅니다.
  imports: [TypeOrmModule.forFeature([Users])], // TypeOrmModule.forFeature() 메서드를 사용하여 User 엔티티를 가져옵니다.
  // imports: [forwardRef(() => AuthModule)], // AuthModule 을 가져와서 사용합니다.
})
export class UsersModule {}
