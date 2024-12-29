import {
  BadRequestException,
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

@Injectable() // NestJS 에서는 @Injectable() 데코레이터를 사용하여 클래스를 서비스로 정의
export class UsersService {
  constructor(
    @InjectRepository(Users) // @InjectRepository() 데코레이터를 사용하여 리포지토리를 주입
    private usersRepository: Repository<Users>, // User 엔티티의 리포지토리를 주입

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<Users> {
    let existingUser: undefined | Users;
    // 사용자 이메일 중복 확인

    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException('요청 시간이 초과되었습니다.', {
        description: '요청 시간이 초과되었습니다.',
      });
    }

    if (existingUser) {
      throw new BadRequestException('이미 사용 중인 이메일입니다.');
    }

    // 에러 발생 시 throw new Error('이미 사용 중인 이메일입니다.');
    if (existingUser) {
      throw new Error('이미 사용 중인 이메일입니다.');
    }

    // 사용자 생성
    let newUser = this.usersRepository.create(createUserDto);

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException('요청 시간이 초과되었습니다.', {
        description: '요청 시간이 초과되었습니다.',
      });
    }
    return newUser;
  }

  findAll(getUsersParamDto: GetUsersParamDto, limit: number, page: number) {
    console.log(this.profileConfiguration);

    return [
      { id: 1, name: 'Alice', email: 'alice@alice.com' },
      { id: 2, name: 'Bob', email: 'bob@bob.com' },
      { id: 3, name: 'Chris', email: 'chris@chris.com' },
    ];
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
}
