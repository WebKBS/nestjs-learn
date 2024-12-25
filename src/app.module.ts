import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/user.entity'; // module: 애플리케이션의 일부분으로, 컨트롤러와 서비스를 묶어주는 역할을 한다.
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';

// module: 애플리케이션의 일부분으로, 컨트롤러와 서비스를 묶어주는 역할을 한다.
@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        // TypeORM 설정
        // TypeORM 설정은 useFactory 함수를 통해 설정한다.
        // useFactory 함수는 TypeORM 설정 객체를 반환한다.
        // TypeORM 설정 객체는 다음과 같은 필드를 가진다.
        // {
        //   type: 'postgres', // 데이터베이스 종류
        //   host: 'localhost', // 데이터베이스 호스트
        //   port: 5432, // 데이터베이스 포트
        //   username: 'postgres', //
        //   password: 'password',
        //   database: 'nestjs-blog', // 데이터베이스 이름
        //   entities: [], // TypeORM 이 사용할 엔티티들을 정의한다.

        //   synchronize: true, // 개발 환경에서는 true, production 환경에서는 false
        imports: [], // 다른 모듈을 가져올 때 사용한다.
        inject: [], // useFactory 함수에 주입할 provider 들을 나열한다.
        type: 'postgres',
        host: 'localhost',
        port: 5433,
        username: 'postgres',
        password: 'postgres',
        database: 'nestjs-blog', // 데이터베이스 이름
        entities: [Users], // TypeORM 이 사용할 엔티티들을 정의한다.
        synchronize: true, // 개발 환경에서는 true, production 환경에서는 false
      }),
    }),
    TagsModule,
    MetaOptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
