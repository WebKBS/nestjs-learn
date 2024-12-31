import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dto/get-users-param.dto';
import { Repository } from 'typeorm';
import { Users } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dto/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';

@Injectable() // NestJS 에서는 @Injectable() 데코레이터를 사용하여 클래스를 서비스로 정의
export class UsersService {
  constructor(
    @InjectRepository(Users) // @InjectRepository() 데코레이터를 사용하여 리포지토리를 주입
    private usersRepository: Repository<Users>, // User 엔티티의 리포지토리를 주입

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
    // Inject Datasource

    private readonly usersCreateManyProvider: UsersCreateManyProvider,
    private readonly createUserProvider: CreateUserProvider,
    // FindOneUserByEmailProvider 를 주입합니다.
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<Users> {
    return await this.createUserProvider.createUser(createUserDto);
  }

  findAll(getUsersParamDto: GetUsersParamDto, limit: number, page: number) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: '이 엔드포인트는 더 이상 사용되지 않습니다.',
        fileName: 'users.service.ts',
        lineNumber: 64,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: '이 엔드포인트는 더 이상 사용되지 않습니다.',
      },
    );
  }

  async findOneById(id: number) {
    let user: undefined | Users;

    try {
      user = await this.usersRepository.findOneBy({ id: id });
    } catch (error) {
      throw new RequestTimeoutException('요청 시간이 초과되었습니다.', {
        description: '요청 시간이 초과되었습니다.',
      });
    }

    if (!user) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async createMany(createManyUsersDto: CreateManyUsersDto): Promise<Users[]> {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

  async findOneByEmail(email: string) {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
  }
}
