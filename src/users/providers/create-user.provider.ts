import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { Users } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from '../../auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @Inject(forwardRef(() => HashingProvider)) // HashingProvider 프로바이더를 주입합니다.
    private readonly hashingProvider: HashingProvider,
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
    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException('요청 시간이 초과되었습니다.', {
        description: '요청 시간이 초과되었습니다.',
      });
    }
    return newUser;
  }
}
