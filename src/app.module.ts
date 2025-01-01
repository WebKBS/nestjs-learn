import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaginationModule } from './common/pagination/pagination.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';

const ENV = process.env.NODE_ENV;
console.log(ENV);

// module: 애플리케이션의 일부분으로, 컨트롤러와 서비스를 묶어주는 역할을 한다.
@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`, // 환경 변수 파일 경로
      load: [appConfig, databaseConfig], // appConfig 함수를 ConfigModule.forRoot 함수에 전달한다.
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 다른 모듈을 가져올 때 사용한다.
      inject: [ConfigService], // useFactory 함수에 주입할 provider 들을 나열한다.
      useFactory: (configService: ConfigService) => ({
        // TypeORM 설정
        // TypeORM 설정은 useFactory 함수를 통해 설정한다.
        // useFactory 함수는 TypeORM 설정 객체를 반환한다.

        type: 'postgres',
        host: configService.get('database.host'),
        port: +configService.get<number>('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        // entities: [Users], // TypeORM 이 사용할 엔티티들을 정의한다.
        autoLoadEntities: configService.get<boolean>(
          'database.autoLoadEntities',
        ), // TypeORM 이 엔티티들을 자동으로 로드하도록 설정한다.

        synchronize: configService.get<boolean>('database.synchronize'), // 개발 환경에서는 true, production 환경에서는 false
      }),
    }),
    TagsModule,
    MetaOptionsModule,
    PaginationModule,

    // 인증 모듈
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 인증 provider
    {
      // APP_GUARD 토큰을 사용하여 AccessTokenGuard 가 사용되도록 설정합니다.
      // 이는 모든 요청에 대해 AccessTokenGuard 가 실행되도록 합니다.
      // 이를 사용하지 않으면 각 컨트롤러나 핸들러에서 @UseGuards() 데코레이터를 사용해야 합니다.
      // 주의 점은 APP_GUARD 는 전역으로 사용되기 때문에 App 모듈에서 설정해야 합니다.
      provide: APP_GUARD,
      useClass: AuthenticationGuard, // APP_GUARD 에 AuthenticationGuard 를 사용합니다.
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
    AccessTokenGuard, // 반드시 AccessTokenGuard 를 providers 에 추가해야 합니다.
  ],
})
export class AppModule {}
