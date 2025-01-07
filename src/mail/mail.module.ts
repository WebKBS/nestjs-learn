import { Global, Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global() // 이 데코레이터는 모듈을 전역으로 만듭니다. 즉, 애플리케이션의 다른 모듈에서 가져올 수 있습니다.
@Module({
  imports: [
    // 이 모듈은 다른 모듈에서 사용할 수 있도록 exports 배열에 MailService 를 추가합니다.
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('app.mailHost'),
          port: 2525,
          secure: false, // 465의 경우 true, 기타 포트의 경우 false
          auth: {
            user: configService.get('app.smtpUsername'),
            pass: configService.get('app.smtpPassword'),
          },
        },

        defaults: {
          from: `My Blog <no-reply@nestjs-blog.com>`,
        },

        // 이메일 템플릿을 사용하기 위해 템플릿 설정을 추가합니다.
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(), // 뷰 템플릿으로 EJS 를 사용합니다.
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
