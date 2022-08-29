import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from 'src/jobs/entities/job.entitiy';
import { JobsModule } from 'src/jobs/jobs.module';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company, CompanySchema } from './entities/company.entitiy';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Company.name,
				schema: CompanySchema
			}
		]),
		MongooseModule.forFeature([
			{
			  name: Job.name,
			  schema: JobSchema,
			},
		  ]),
		JobsModule
	],
	controllers: [ CompaniesController ],
	providers: [ CompaniesService ],
	exports: [ CompaniesService ]
})
export class CompaniesModule {}
