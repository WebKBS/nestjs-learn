import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

// controller: 요청을 받아서 응답을 반환하는 역할을 한다.
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
