import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'src/companies/entities/company.entitiy';
import { Job, JobSchema } from 'src/jobs/entities/job.entitiy';
import { User, UserSchema } from 'src/users/entitiy/user.entitiy';
import { Activity, ActivitySchema } from 'tools/entities/activity.entitiy';
import { Group, GroupSchema } from 'src/group/entities/group.entity';
import { Role, RoleSchema } from 'src/role/entities/role.entitiy';
import { Ticket, TicketSchema } from 'src/ticket/entities/ticket.entitiy';
import { TotalController } from './total.controller';
import { TotalService } from './total.service';
import {
  TicketType,
  TicketTypeSchema,
} from 'src/ticket-types/entities/ticket-type.entitiy';
import { News, NewsSchema } from 'src/news/entities/news.entitiy';
import {
  Scrapper,
  ScrapperSchema,
} from 'src/scrapper/entitiy/scrapper.entitiy';
import { Publisher, PublisherSchema } from 'src/publisher/entities/publisher.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Job.name,
        schema: JobSchema,
      },
      {
        name: Company.name,
        schema: CompanySchema,
      },
      {
        name: Group.name,
        schema: GroupSchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: Activity.name,
        schema: ActivitySchema,
      },
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
      {
        name: TicketType.name,
        schema: TicketTypeSchema,
      },
      {
        name: News.name,
        schema: NewsSchema,
      },
      {
        name: Scrapper.name,
        schema: ScrapperSchema,
      },
      {
        name: Publisher.name,
        schema: PublisherSchema,
      },
    ]),
  ],
  controllers: [TotalController],
  providers: [TotalService],
})
export class TotalModule {}
