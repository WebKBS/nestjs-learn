import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// bootstrap: 애플리케이션을 생성하고, 지정된 포트에서 애플리케이션을 실행하는 역할을 한다.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 데코레이터가 없는 속성은 자동 제거
      forbidNonWhitelisted: true, // 데코레이터가 없는 속성이 있을 경우 요청을 막음
      transform: true, // 요청에서 넘어온 자료형을 원하는 자료형으로 변환
      transformOptions: {
        enableImplicitConversion: true, // 자료형 변환을 자동으로 처리
      },
    }),
  ); // 모든 요청에 대한 유효성 검사를 수행

  const config = new DocumentBuilder()
    .setVersion('1.0') // API 문서의 버전
    .setTitle('NestJS API') // API 문서의 제목
    .setDescription('NestJS API 문서입니다.') // API 문서의 설명
    .addServer('http://localhost:3000') // API 서버의 주소
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI를 설정

  app.enableCors(); // CORS 설정 => 다른 도메인에서 API를 호출할 수 있도록 허용
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().then(() => console.log('NestJS Application is running!'));
