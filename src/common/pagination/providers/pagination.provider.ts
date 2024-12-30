import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/pagination-query-dto';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PaginationProvider {
  // 설명: PaginationQueryDto 를 기반으로 Repository 에서 데이터를 가져옵니다.
  public async paginatedQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ) {
    return await repository.find({
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });
  }
}
