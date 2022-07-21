import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GroupModule } from 'src/group/group.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { RoleModule } from 'src/role/role.module';
import { TicketModule } from 'src/ticket/ticket.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AuthGuard } from './guards/auth.guard';
import { TicketGuard } from './guards/ticket.guard';
import { LoggingMiddleware } from './middlwares/logging.middleware';

@Module({
  imports: [ConfigModule, GroupModule, JobsModule, RoleModule, TicketModule],
  providers: [
    // { provide: APP_GUARD, useClass: ApiKeyGuard }
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .exclude(
        { path: 'jobs', method: RequestMethod.GET },
        // { path: '/jobs/:id', method: RequestMethod.GET },
        { path: 'companies', method: RequestMethod.GET },
        { path: 'news', method: RequestMethod.GET },
        { path: 'users', method: RequestMethod.GET },
        { path: 'tickets', method: RequestMethod.GET },
        { path: 'ticket-types', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
