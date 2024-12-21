import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from '../../auth/providers/auth/auth.service';

@Injectable() // NestJS 에서는 @Injectable() 데코레이터를 사용하여 클래스를 서비스로 정의
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  findAll(getUsersParamDto: GetUsersParamDto, limit: number, page: number) {
    const isAuth = this.authService.isAuth();

    if (!isAuth) {
      return 'Not authenticated';
    }

    return [
      { id: 1, name: 'Alice', email: 'alice@alice.com' },
      { id: 2, name: 'Bob', email: 'bob@bob.com' },
      { id: 3, name: 'Chris', email: 'chris@chris.com' },
    ];
  }

  findOneById(userId: string) {
    return { id: userId, name: 'Alice', email: 'alice@alice.com' };
  }
}
