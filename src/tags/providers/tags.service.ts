import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tags } from '../tags.entity';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from '../dto/create-tag-dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tags)
    private tagsRepository: Repository<Tags>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  async findMultipleTags(tags: number[]) {
    return await this.tagsRepository.find({
      where: {
        id: In(tags),
      },
    });
  }

  async delete(id: number) {
    await this.tagsRepository.delete(id);
    return {
      deleted: true,
      id,
    };
  }

  async softRemove(id: number) {
    await this.tagsRepository.softDelete(id);
    return {
      deleted: true,
      id,
    };
  }
}
