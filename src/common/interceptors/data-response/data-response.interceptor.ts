import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor() {} // ConfigService 를 주입한다.

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    return next.handle().pipe(
      // next.handle()은 요청을 처리하는 핸들러를 호출한다. pipe()는 옵저버블을 반환한다.
      map((data) => {
        console.log('After...');
        return {
          message: '데이터 조회 성공',
          data,
        };
      }),
    );
  }
}
