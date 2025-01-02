import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Upload } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { UploadFile } from '../interfaces/upload-file.interface';
import { FileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    private readonly configService: ConfigService,
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    // 이미지 파일인지 확인
    if (
      !['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('이미지 파일만 업로드 가능합니다.');
    }

    try {
      // s3 에 파일 업로드
      const name = await this.uploadToAwsProvider.fileUpload(file);

      // 파일 정보 저장
      const uploadFile: UploadFile = {
        name: file.originalname,
        path: `https://${this.configService.get('app.awsCloudFrontUrl')}/${name}`,
        size: file.size,
        mime: file.mimetype,
        type: FileTypes.IMAGE,
      };

      // 파일 정보 DB에 저장
      const upload = this.uploadRepository.create(uploadFile);
      return this.uploadRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error, {
        description: '파일 업로드에 실패했습니다.',
      });
    }
  }
}
