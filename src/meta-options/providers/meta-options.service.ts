import { Injectable } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from '../dto/create-post-meta-options.dto';
import { Repository } from 'typeorm';
import { MetaOptions } from '../meta-options.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOptions)
    private readonly metaOptionsRepository: Repository<MetaOptions>,
  ) {}

  async create(createMetaOptionsDto: CreatePostMetaOptionsDto) {
    let metaOption = this.metaOptionsRepository.create(createMetaOptionsDto);

    return await this.metaOptionsRepository.save(metaOption);
  }
}
