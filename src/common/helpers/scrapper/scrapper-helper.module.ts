import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'src/companies/entities/company.entitiy';
import { Job, JobSchema } from 'src/jobs/entities/job.entitiy';
import { JobsModule } from 'src/jobs/jobs.module';
import { ScrapperHelperService } from './scrapper-helper.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Job.name,
        schema: JobSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Company.name,
        schema: CompanySchema,
      },
    ]),
  ],
  providers: [ScrapperHelperService],
  exports: [ScrapperHelperService],
})
export class ScrapperHelperModule {}
