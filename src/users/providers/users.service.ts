import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dto/get-users-param.dto';
import { Repository } from 'typeorm';
import { Users } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable() // NestJS 에서는 @Injectable() 데코레이터를 사용하여 클래스를 서비스로 정의
export class UsersService {
  constructor(
    @InjectRepository(Users) // @InjectRepository() 데코레이터를 사용하여 리포지토리를 주입
    private usersRepository: Repository<Users>, // User 엔티티의 리포지토리를 주입

    // ConfigService 주입
    private readonly configService: ConfigService,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<Users> {
    // 사용자 이메일 중복 확인
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    // 에러 발생 시 throw new Error('이미 사용 중인 이메일입니다.');
    if (existingUser) {
      throw new Error('이미 사용 중인 이메일입니다.');
    }

    // 사용자 생성
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);
    return newUser;
  }

  findAll(getUsersParamDto: GetUsersParamDto, limit: number, page: number) {
    const environment = this.configService.get<string>('S3_BUCKET');
    console.log(environment);

    return [
      { id: 1, name: 'Alice', email: 'alice@alice.com' },
      { id: 2, name: 'Bob', email: 'bob@bob.com' },
      { id: 3, name: 'Chris', email: 'chris@chris.com' },
    ];
  }

  async findOneById(id: number) {
    return await this.usersRepository.findOneBy({ id: id });
  }
}
