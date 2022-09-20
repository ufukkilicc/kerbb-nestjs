import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DateHelper, nowDateTurkey } from 'src/common/helpers/dateHelper';
import { CompaniesService } from 'src/companies/companies.service';
import { Company } from 'src/companies/entities/company.entitiy';
import { FilterDto } from 'tools/dtos/filter.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entitiy';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    private readonly configService: ConfigService,
    private readonly companiesService: CompaniesService,
  ) {}
  generalSearchQuery = {
    page: 1,
    size: 10,
    sort: 'ASC',
    sort_by: 'job_title',
    query_text: '',
    location_query_text: '',
    search_title_by: 'job_title',
    search_location_by: 'job_location',
    search_company_by: 'company',
    search_scrape_by: 'scrape_name',
    search_date_by: 'date',
    is_highlighted: false,
    search_highlighted_by: 'is_highlighted',
    date: 'whole',
  };
  async findAll(query?: FilterDto) {
    if (Object.keys(query).length !== 0) {
      const searchValue = await { ...this.generalSearchQuery, ...query };
      const userRegex = new RegExp(searchValue.query_text.trim(), 'i');
      const locationRegex = new RegExp(searchValue.location_query_text, 'i');

      const theNow = nowDateTurkey();
      const threeHours = theNow.setHours(theNow.getHours() - 3);
      const twentyFourHours = theNow.setHours(theNow.getHours() - 24);
      const sevenDays = theNow.setDate(theNow.getDate() - 7);
      const oneMonth = theNow.setDate(theNow.getDate() - 30);

      console.log({ theNow, threeHours, twentyFourHours, sevenDays });
      console.log({ searchValue });
      if (searchValue.is_highlighted) {
        return await this.jobModel
          .find({})
          .and([
            {
              $or: [
                {
                  [searchValue.search_title_by]: userRegex,
                },
                {
                  [searchValue.search_company_by]: userRegex,
                },
                {
                  [searchValue.search_scrape_by]: userRegex,
                },
              ],
            },
            { [searchValue.search_location_by]: locationRegex },
            {
              [searchValue.search_highlighted_by]: searchValue.is_highlighted,
            },
          ])
          .sort({
            [searchValue.sort_by]: searchValue.sort === 'ASC' ? 'asc' : 'desc',
          })
          .limit(Math.max(0, searchValue.size))
          .skip(searchValue.size * (searchValue.page - 1))
          .populate([{ path: 'job_tags', populate: 'tag_type' }])
          .populate('job_company')
          .exec();
      } else {
        if (searchValue.date === 'three-hours') {
          console.log('three-hours');
          return await this.jobModel
            .find({})
            .and([
              {
                $or: [
                  {
                    [searchValue.search_title_by]: userRegex,
                  },
                  {
                    [searchValue.search_company_by]: userRegex,
                  },
                  {
                    [searchValue.search_scrape_by]: userRegex,
                  },
                ],
              },
              { [searchValue.search_location_by]: locationRegex },
              {
                [searchValue.search_date_by]: { $gt: threeHours },
              },
            ])
            .sort({
              [searchValue.sort_by]:
                searchValue.sort === 'ASC' ? 'asc' : 'desc',
            })
            .limit(Math.max(0, searchValue.size))
            .skip(searchValue.size * (searchValue.page - 1))
            .populate([{ path: 'job_tags', populate: 'tag_type' }])
            .populate('job_company')
            .exec();
        } else if (searchValue.date === 'twenty-four-hours') {
          console.log('twenty-four-hours');
          return await this.jobModel
            .find({})
            .and([
              {
                $or: [
                  {
                    [searchValue.search_title_by]: userRegex,
                  },
                  {
                    [searchValue.search_company_by]: userRegex,
                  },
                  {
                    [searchValue.search_scrape_by]: userRegex,
                  },
                ],
              },
              { [searchValue.search_location_by]: locationRegex },
              {
                [searchValue.search_date_by]: { $gt: twentyFourHours },
              },
            ])
            .sort({
              [searchValue.sort_by]:
                searchValue.sort === 'ASC' ? 'asc' : 'desc',
            })
            .limit(Math.max(0, searchValue.size))
            .skip(searchValue.size * (searchValue.page - 1))
            .populate([{ path: 'job_tags', populate: 'tag_type' }])
            .populate('job_company')
            .exec();
        } else if (searchValue.date === 'seven-days') {
          console.log('seven-days');
          return await this.jobModel
            .find({})
            .and([
              {
                $or: [
                  {
                    [searchValue.search_title_by]: userRegex,
                  },
                  {
                    [searchValue.search_company_by]: userRegex,
                  },
                  {
                    [searchValue.search_scrape_by]: userRegex,
                  },
                ],
              },
              { [searchValue.search_location_by]: locationRegex },
              {
                [searchValue.search_date_by]: { $gt: sevenDays },
              },
            ])
            .sort({
              [searchValue.sort_by]:
                searchValue.sort === 'ASC' ? 'asc' : 'desc',
            })
            .limit(Math.max(0, searchValue.size))
            .skip(searchValue.size * (searchValue.page - 1))
            .populate([{ path: 'job_tags', populate: 'tag_type' }])
            .populate('job_company')
            .exec();
        } else if (searchValue.date === 'one-month') {
          console.log('one-month');
          return await this.jobModel
            .find({})
            .and([
              {
                $or: [
                  {
                    [searchValue.search_title_by]: userRegex,
                  },
                  {
                    [searchValue.search_company_by]: userRegex,
                  },
                  {
                    [searchValue.search_scrape_by]: userRegex,
                  },
                ],
              },
              { [searchValue.search_location_by]: locationRegex },
              {
                [searchValue.search_date_by]: { $gt: oneMonth },
              },
            ])
            .sort({
              [searchValue.sort_by]:
                searchValue.sort === 'ASC' ? 'asc' : 'desc',
            })
            .limit(Math.max(0, searchValue.size))
            .skip(searchValue.size * (searchValue.page - 1))
            .populate([{ path: 'job_tags', populate: 'tag_type' }])
            .populate('job_company')
            .exec();
        } else if (searchValue.date === 'whole') {
          console.log('whole');
          return await this.jobModel
            .find({})
            .and([
              {
                $or: [
                  {
                    [searchValue.search_title_by]: userRegex,
                  },
                  {
                    [searchValue.search_company_by]: userRegex,
                  },
                  {
                    [searchValue.search_scrape_by]: userRegex,
                  },
                ],
              },
              { [searchValue.search_location_by]: locationRegex },
            ])
            .sort({
              [searchValue.sort_by]:
                searchValue.sort === 'ASC' ? 'asc' : 'desc',
            })
            .limit(Math.max(0, searchValue.size))
            .skip(searchValue.size * (searchValue.page - 1))
            .populate([{ path: 'job_tags', populate: 'tag_type' }])
            .populate('job_company')
            .exec();
        }
      }
    } else {
      return await this.jobModel
        .find({})
        .limit(Math.max(0, this.generalSearchQuery.size))
        .skip(this.generalSearchQuery.size * (this.generalSearchQuery.page - 1))
        .sort([
          [`${this.generalSearchQuery.sort_by}`, this.generalSearchQuery.sort],
        ])
        .populate([{ path: 'job_tags', populate: 'tag_type' }])
        .populate('job_company')
        .exec();
    }
  }
  async findCount() {
    return await this.jobModel.countDocuments();
  }
  async findOne(id: string) {
    const job = await this.jobModel
      .findOne({ _id: id })
      .populate([{ path: 'job_tags', populate: 'tag_type' }])
      .populate('job_company')
      .exec();
    if (!job) {
      throw new NotFoundException(`Job ${id} was not found`);
    }
    return job;
  }
  async findOneByLink(jobLink: string) {
    const job = await this.jobModel.findOne({ job_link: jobLink }).exec();
    return job;
  }
  create(createJobDto: CreateJobDto) {
    const job = new this.jobModel(createJobDto);
    return job.save();
  }
  async update(id: string, updateJobDto: UpdateJobDto) {
    const existingJob = await this.jobModel
      .findOneAndUpdate({ _id: id }, { $set: updateJobDto }, { new: true })
      .populate([{ path: 'job_tags', populate: 'tag_type' }])
      .exec();

    if (!existingJob) {
      throw new NotFoundException(`Job ${id} was not found`);
    }
    return existingJob;
  }
  async incrementView(id: string) {
    const existingJob = await this.jobModel
      .findOneAndUpdate({ _id: id }, { $inc: { job_views: 1 } }, { new: true })
      .exec();
    const existingCompany = await this.companyModel
      .findOneAndUpdate(
        { scrape_name: existingJob.scrape_name },
        { $inc: { redirect_count: 1 } },
        { new: true },
      )
      .exec();
    if (!existingJob) {
      throw new NotFoundException(`Job ${id} was not found`);
    }
    return existingJob;
  }
  async highlightJob(id: string) {
    const job = await this.findOne(id);
    const existingJob = await this.jobModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { is_highlighted: !job.is_highlighted } },
        { new: true },
      )
      .populate([{ path: 'job_tags', populate: 'tag_type' }])
      .populate('job_company')
      .exec();

    if (!existingJob) {
      throw new NotFoundException(`Job ${id} was not found`);
    }
    return existingJob;
  }
  async highlightOrderJob(id: string, highlight_order: number) {
    const job = await this.findOne(id);
    if (!job.is_highlighted) {
      throw new BadRequestException(
        `Company ${id} highlight order can not be setted if it's not highlighted`,
      );
    }
    const existingJob = await this.jobModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { highlight_order: highlight_order } },
        { new: true },
      )
      .populate([{ path: 'job_tags', populate: 'tag_type' }])
      .populate('job_company')
      .exec();

    if (!existingJob) {
      throw new NotFoundException(`Job ${id} was not found`);
    }
    return existingJob;
  }
  async approveJob(id: string) {
    const job = await this.findOne(id);
    const existingJob = await this.jobModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { is_approved: !job.is_approved } },
        { new: true },
      )
      .populate([{ path: 'job_tags', populate: 'tag_type' }])
      .populate('job_company')
      .exec();

    if (!existingJob) {
      throw new NotFoundException(`Job ${id} was not found`);
    }
    return existingJob;
  }
  // async decrementView(id: string) {
  //   const existingJob = await this.jobModel
  //     .findOneAndUpdate({ _id: id }, { $inc: { job_views: -1 } }, { new: true })
  //     .exec();

  //   if (!existingJob) {
  //     throw new NotFoundException(`Job ${id} was not found`);
  //   }
  //   return existingJob;
  // }
  async remove(id: string) {
    const job = await this.findOne(id);
    return job.remove();
  }
  async removeAll(): Promise<any> {
    return await this.jobModel.deleteMany({}).exec();
  }
}
