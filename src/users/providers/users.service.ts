import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dto/get-users-param.dto';
import { DataSource, Repository } from 'typeorm';
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
    // Inject Datasource
    private readonly dataSource: DataSource, // DATASOURCE 는 데이터베이스 연결을 나타내는 DataSource 인터페이스의 인스턴스
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

  async createMany(createUsersDto: CreateUserDto[]): Promise<Users[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect(); // 데이터베이스 연결
    await queryRunner.startTransaction(); // 트랜잭션 시작

    const newUsers: Users[] = [];

    try {
      for (const userDto of createUsersDto) {
        const newUser = queryRunner.manager.create(Users, userDto); // 엔티티 생성
        const savedUser = await queryRunner.manager.save(newUser); // 엔티티 저장
        newUsers.push(savedUser);
      }

      await queryRunner.commitTransaction(); // 트랜잭션 커밋
      return newUsers; // 생성된 사용자 목록 반환
    } catch (error) {
      await queryRunner.rollbackTransaction(); // 트랜잭션 롤백
      throw new BadRequestException('사용자 생성 중 문제가 발생했습니다.', {
        cause: error,
        description: error.message,
      });
    } finally {
      await queryRunner.release(); // queryRunner 해제
    }
  }
}
