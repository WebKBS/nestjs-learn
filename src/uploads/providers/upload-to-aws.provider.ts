import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadToAwsProvider {
  constructor(private readonly configService: ConfigService) {}

  public async fileUpload(file: Express.Multer.File) {
    // Upload file to AWS
    const s3 = new S3();

    console.log(this.configService.get('app.awsBucketName'));
    try {
      // 파일 업로드
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('app.awsBucketName'),
          Body: file.buffer,
          Key: this.generateFileName(file),
          ContentType: file.mimetype,
        })
        .promise();

      return uploadResult.Key;
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException('파일 업로드에 실패했습니다.');
    }
  }

  // 파일 이름을 생성하는 메서드
  private generateFileName(file: Express.Multer.File) {
    // 파일 이름 추출
    const name = file.originalname.split('.')[0];

    // white space를 _로 변경
    name.replace(/\s/g, '').trim();

    // 파일 확장자 추출
    const extension = path.extname(file.originalname);

    // timestamp 생성
    const timestamp = new Date().getTime().toString().trim();

    // 파일 이름 생성
    return `${name}-${timestamp}-${uuidv4()}${extension}`;
  }
}
