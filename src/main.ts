import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// bootstrap: 애플리케이션을 생성하고, 지정된 포트에서 애플리케이션을 실행하는 역할을 한다.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 데코레이터가 없는 속성은 자동 제거
      // forbidNonWhitelisted: true, // 데코레이터가 없는 속성이 있을 경우 요청을 막음
      // transform: true, // 요청에서 넘어온 자료형을 원하는 자료형으로 변환
    }),
  ); // 모든 요청에 대한 유효성 검사를 수행
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().then(() => console.log('NestJS Application is running!'));
