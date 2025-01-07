import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Users } from '../../users/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendUserWelcome(user: Users): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email, // 수신자 이메일 주소
      from: `Onboarding Team <support@nestjs-blog.com>`, // 보내는 사람
      subject: 'Welcome to My Blog!', // 이메일 제목
      template: './welcome', // 이 템플릿은 src/mail/templates/welcome.ejs 파일을 사용합니다.
      context: {
        name: user.firstName,
        email: user.email,
        loginUrl: 'http//localhost:3000',
      },
    });
  }
}
