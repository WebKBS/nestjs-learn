import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import profileConfig from './config/profile.config';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersCreateManyProvider, CreateUserProvider],
  exports: [UsersService], // 다른 모듈에서 UsersService 를 사용할 수 있도록 내보냅니다.
  imports: [
    TypeOrmModule.forFeature([Users]),
    ConfigModule.forFeature(profileConfig),
    forwardRef(() => AuthModule),
  ], // TypeOrmModule.forFeature() 메서드를 사용하여 User 엔티티를 가져옵니다.
})
export class UsersModule {}
