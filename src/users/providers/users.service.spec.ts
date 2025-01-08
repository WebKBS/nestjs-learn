import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { CreateUserProvider } from './create-user.provider';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../user.entity';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DataSource, useValue: {} }, // DataSource 를 더미로 주입합니다.
        { provide: getRepositoryToken(Users), useValue: {} }, // Users 리포지토리를 더미로 주입합니다.
        { provide: CreateGoogleUserProvider, useValue: {} }, // CreateGoogleUserProvider 를 더미로 주입합니다.
        { provide: FindOneByGoogleIdProvider, useValue: {} },
        { provide: FindOneUserByEmailProvider, useValue: {} },
        { provide: CreateUserProvider, useValue: {} },
        { provide: UsersCreateManyProvider, useValue: {} },
        {
          provide: 'CONFIGURATION(profileConfig)',
          useValue: {}, // 빈 객체를 사용하거나 필요한 경우 실제 값을 모킹
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
