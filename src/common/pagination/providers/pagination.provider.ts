import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/pagination-query-dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    // Injecting request
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  // 설명: PaginationQueryDto 를 기반으로 Repository 에서 데이터를 가져옵니다.
  public async paginatedQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const results = await repository.find({
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });

    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';

    const newUrl = new URL(this.request.url, baseURL);

    // 계산된 페이지 수
    const totalItems = await repository.count(); // 전체 아이템 수
    const totalPages = Math.ceil(totalItems / paginationQuery.limit); // 전체 페이지 수
    const nextPage =
      paginationQuery.page === totalPages ? null : paginationQuery.page + 1;
    // 다음 페이지
    const prevPage =
      paginationQuery.page === 1
        ? paginationQuery.page
        : paginationQuery.page - 1; // 이전 페이지

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: paginationQuery.limit,
        totalItems: totalItems,
        totalPages: totalPages,
        currentPage: paginationQuery.page,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?page=1&limit=${paginationQuery.limit}`,
        current: `${newUrl.origin}${newUrl.pathname}?page=${paginationQuery.page}&limit=${paginationQuery.limit}`,
        next: nextPage
          ? `${newUrl.origin}${newUrl.pathname}?page=${nextPage}&limit=${paginationQuery.limit}`
          : null,
        previous: prevPage
          ? `${newUrl.origin}${newUrl.pathname}?page=${prevPage}&limit=${paginationQuery.limit}`
          : null,
        last: `${newUrl.origin}${newUrl.pathname}?page=${totalPages}&limit=${paginationQuery.limit}`,
      },
    };
    console.log(totalPages);

    return finalResponse;
  }
}
