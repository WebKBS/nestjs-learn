import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// bootstrap: 애플리케이션을 생성하고, 지정된 포트에서 애플리케이션을 실행하는 역할을 한다.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
