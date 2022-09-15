import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/companies/entities/company.entitiy';
import { Job } from 'src/jobs/entities/job.entitiy';
import { User } from 'src/users/entitiy/user.entitiy';
import { Activity } from 'tools/entities/activity.entitiy';
import { Group } from 'src/group/entities/group.entity';
import { Role } from 'src/role/entities/role.entitiy';
import { Ticket } from 'src/ticket/entities/ticket.entitiy';
import { TicketType } from 'src/ticket-types/entities/ticket-type.entitiy';
import { News } from 'src/news/entities/news.entitiy';
import { Scrapper } from 'src/scrapper/entitiy/scrapper.entitiy';
import { Publisher } from 'src/publisher/entities/publisher.entity';

@Injectable()
export class TotalService {
  constructor(
    @InjectModel(User.name) private readonly userMongo: Model<User>,
    @InjectModel(Job.name) private readonly jobMongo: Model<Job>,
    @InjectModel(Company.name) private readonly companyMongo: Model<User>,
    @InjectModel(News.name) private readonly newsMongo: Model<News>,
    @InjectModel(Group.name) private readonly groupMongo: Model<Group>,
    @InjectModel(Role.name) private readonly roleMongo: Model<Role>,
    @InjectModel(Activity.name) private readonly activityMongo: Model<Activity>,
    @InjectModel(Ticket.name) private readonly ticketMongo: Model<Ticket>,
    @InjectModel(Scrapper.name) private readonly scrapperMongo: Model<Scrapper>,
    @InjectModel(TicketType.name)
    private readonly ticketTypeMongo: Model<TicketType>,
    @InjectModel(Publisher.name)
    private readonly publisherMongo: Model<Publisher>,
  ) {}

  async findAll(): Promise<any> {
    const userCount = await this.userMongo.countDocuments({}).exec();
    const jobCount = await this.jobMongo.countDocuments({}).exec();
    const companyCount = await this.companyMongo.countDocuments({}).exec();
    const newsCount = await this.newsMongo.countDocuments({}).exec();
    const groupCount = await this.groupMongo.countDocuments({}).exec();
    const roleCount = await this.roleMongo.countDocuments({}).exec();
    const activityCount = await this.activityMongo.countDocuments({}).exec();
    const ticketCount = await this.ticketMongo.countDocuments({}).exec();
    const scrapperCount = await this.scrapperMongo.countDocuments({}).exec();
    const ticketTypeCount = await this.ticketTypeMongo
      .countDocuments({})
      .exec();
    const publisherCount = await this.publisherMongo.countDocuments({}).exec();

    return await {
      job: jobCount,
      company: companyCount,
      news: newsCount,
      user: userCount,
      scrapper: scrapperCount,
      group: groupCount,
      role: roleCount,
      activity: activityCount,
      ticket: ticketCount,
      ticketType: ticketTypeCount,
      publisher: publisherCount,
    };
  }
}
