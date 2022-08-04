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

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .exclude(
        { path: 'jobs', method: RequestMethod.GET },
        { path: 'jobs/:id', method: RequestMethod.GET },
        { path: 'jobs/:id/inc-view', method: RequestMethod.PATCH },
        { path: 'companies/:id', method: RequestMethod.GET },
        { path: 'companies', method: RequestMethod.GET },
        { path: 'companies/:id/inc-view', method: RequestMethod.PATCH },
        // { path: 'companies/:id/download', method: RequestMethod.GET },
        { path: 'news', method: RequestMethod.GET },
        { path: 'news/:id', method: RequestMethod.GET },
        { path: 'news/:id/inc-view', method: RequestMethod.PATCH },
        { path: 'users', method: RequestMethod.GET },
        { path: 'users/:id', method: RequestMethod.GET },
        { path: 'scrapper', method: RequestMethod.GET },
        { path: 'tickets', method: RequestMethod.GET },
        { path: 'ticket-types', method: RequestMethod.GET },
        { path: 'tags', method: RequestMethod.GET },
        { path: 'tag-types', method: RequestMethod.GET },
        { path: 'role', method: RequestMethod.GET },
        { path: 'total', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
