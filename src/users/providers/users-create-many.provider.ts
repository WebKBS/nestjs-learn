import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dto/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  async createMany(createManyUsersDto: CreateManyUsersDto): Promise<Users[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    const newUsers: Users[] = [];

    try {
      await queryRunner.connect(); // 데이터베이스 연결
      await queryRunner.startTransaction(); // 트랜잭션 시작
    } catch (error) {
      await queryRunner.rollbackTransaction(); // 트랜잭션 롤백

      throw new BadRequestException(
        '데이터베이스 연결 중 문제가 발생했습니다.',
        {
          cause: error,
          description: error.message,
        },
      );
    }

    try {
      for (const userDto of createManyUsersDto.users) {
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
