import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsModule } from './jobs/jobs.module';
import { CompaniesModule } from './companies/companies.module';
import { ScrapperModule } from './scrapper/scrapper.module';
import { NewsModule } from './news/news.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { LibsModule } from 'libs/libs.module';
import { ActivityModule } from './activity/activity.module';
import { GroupModule } from './group/group.module';
import { RoleModule } from './role/role.module';
import { TotalModule } from './total/total.module';
import { AuthModule } from './auth/auth.module';
import { TokenMiddleware } from './common/middlwares/token.middleware';
import { UploadModule } from './upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { ScrapperHelperModule } from './common/helpers/scrapper/scrapper-helper.module';
import { TicketModule } from './ticket/ticket.module';
import { TicketTypesModule } from './ticket-types/ticket-types.module';
import { TagsModule } from './tags/tags.module';
import { TagTypesModule } from './tag-types/tag-types.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './common/helpers/tasks/tasksService.module';
import { MailerModule } from '@nestjs-modules/mailer/';
import { EmailModule } from './email/email.module';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { PublisherController } from './publisher/publisher.controller';
import { PublisherService } from './publisher/publisher.service';
import { PublisherModule } from './publisher/publisher.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      template: {
        dir: join(__dirname.slice(0, -4), 'mails'),
        adapter: new HandlebarsAdapter(),
      },
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_MONGO_URI),
    JobsModule,
    CompaniesModule,
    ScrapperModule,
    NewsModule,
    CommonModule,
    UsersModule,
    LibsModule,
    ActivityModule,
    GroupModule,
    RoleModule,
    TotalModule,
    AuthModule,
    UploadModule,
    ScrapperHelperModule,
    TicketModule,
    TicketTypesModule,
    MulterModule.register({
      dest: './upload',
    }),
    TicketTypesModule,
    TagsModule,
    TagTypesModule,
    TasksModule,
    EmailModule,
    PublisherModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 	{
    // 	provide:APP_PIPE,
    // 	useClass: ValidationPipe
    // }
  ],
})
export class AppModule { }
