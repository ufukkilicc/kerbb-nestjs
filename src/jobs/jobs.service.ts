import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterDto } from 'tools/dtos/filter.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entitiy';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
    private readonly configService: ConfigService,
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
  };
  async findAll(query?: FilterDto) {
    if (Object.keys(query).length !== 0) {
      const searchValue = await { ...this.generalSearchQuery, ...query };
      const userRegex = new RegExp(searchValue.query_text, 'i');
      const locationRegex = new RegExp(searchValue.location_query_text, 'i');
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
        .limit(Math.max(0, searchValue.size))
        .skip(searchValue.size * (searchValue.page - 1))
        .sort([[`${searchValue.sort_by}`, searchValue.sort]])
        .populate([{ path: 'job_tags', populate: 'tag_type' }])
        .populate('job_company')
        .exec();
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
