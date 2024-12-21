import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

// module: 애플리케이션의 일부분으로, 컨트롤러와 서비스를 묶어주는 역할을 한다.
@Module({
  imports: [UsersModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
