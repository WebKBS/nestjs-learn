import { Injectable } from '@nestjs/common';

// service: 비즈니스 로직을 처리하는 역할을 한다.
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
