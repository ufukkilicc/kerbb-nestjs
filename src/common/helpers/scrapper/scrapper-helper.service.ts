import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/companies/entities/company.entitiy';
import { Job } from 'src/jobs/entities/job.entitiy';
import { JobsService } from 'src/jobs/jobs.service';
import { CreateScrapperDto } from 'src/scrapper/dto/create-scrapper.dto';

@Injectable()
export class ScrapperHelperService {
  title: string;
  success: boolean = false;
  error_message: string = '';
  jobs_added: Job[] = [];
  jobs_extracted: Job[] = [];
  start_date: Date;
  start_time: number;
  jobs: Job[];
  current_jobs: Job[];
  jobs_found: number;
  end_date: Date;
  end_time: number;
  time_lasts: number;
  time_lasts_rounded: number;
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) {}
  async runScrapper(title: string, callback) {
    this.error_message = '';
    this.jobs_added = [];
    this.jobs_extracted = [];
    this.title = title;
    this.start_date = new Date();
    this.start_time = new Date().getTime();
    try {
    this.jobs = await callback();
    this.success = true;
    this.jobs_found = this.jobs.length;
    this.end_date = new Date();
    this.end_time = new Date().getTime();
    this.time_lasts = (this.end_time - this.start_time) / 1000;
    this.time_lasts_rounded = Math.round(this.time_lasts * 10) / 10;
    this.current_jobs = await this.jobModel
      .find({})
      .or([
        {
          company: this.title,
        },
        {
          scrape_name: this.title,
        },
      ])
      .exec();
    const companies = await this.companyModel.find({ scrape_name: title });
    const company = companies[0];
    const company_id = company._id;
    await this.companyModel.findByIdAndUpdate(company_id, {
      job_count: this.jobs_found,
    });
    for (const job of this.jobs) {
      const jobLink = job.job_link;
      const existing_job = await this.jobModel
        .findOne({ job_link: jobLink })
        .exec();
      if (existing_job === null) {
        const job_added = new this.jobModel(job);
        job_added.job_company = company;
        await job_added.save();
        this.jobs_added.push(job); // Does'nt work
      }
    }
    for (const job of this.current_jobs) {
      const jobLink = job.job_link;
      const existing_job = await this.jobs.filter(
        (job) => job.job_link === jobLink,
      );
      if (existing_job[0] === undefined) {
        const job = await this.jobModel
          .findOneAndDelete({ job_link: jobLink })
          .exec();
        this.jobs_extracted.push(job); // Does'nt work
      }
    }
    const createScrapperDto: CreateScrapperDto = {
      scrapper_title: this.title,
      scrapper_company: company,
      scrapper_success: this.success,
      scrapper_error_message: this.error_message,
      scrapper_start_date: this.start_date,
      scrapper_end_date: this.end_date,
      scrapper_time_lasts: this.time_lasts_rounded,
      scrapper_jobs_found: this.jobs_found,
      scrapper_jobs_added_count: this.jobs_added.length,
      scrapper_jobs_added: this.jobs_added,
      scrapper_jobs_extracted_count: this.jobs_extracted.length,
      scrapper_jobs_extracted: this.jobs_extracted,
    };
    return createScrapperDto;
    } catch (error) {
      this.success = false;
      this.error_message = `${error}`;
      const companies = await this.companyModel.find({ scrape_name: title });
      const company = companies[0];
      const createScrapperDto: CreateScrapperDto = {
        scrapper_title: this.title,
        scrapper_company: company,
        scrapper_success: this.success,
        scrapper_error_message: this.error_message,
        scrapper_start_date: undefined,
        scrapper_end_date: undefined,
        scrapper_time_lasts: undefined,
        scrapper_jobs_found: undefined,
        scrapper_jobs_added_count: undefined,
        scrapper_jobs_added: [],
        scrapper_jobs_extracted_count: undefined,
        scrapper_jobs_extracted: [],
      };
      return createScrapperDto;
    }
    
  }
}
