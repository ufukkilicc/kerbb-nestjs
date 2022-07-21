import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapperHelperModule } from 'src/common/helpers/scrapper-helper.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { NewsModule } from 'src/news/news.module';
import { Scrapper, ScrapperSchema } from './entitiy/scrapper.entitiy';
import { ScrapperController } from './scrapper.controller';
import { ScrapperService } from './scrapper.service';

@Module({
	imports: [
		JobsModule,
		NewsModule,
		CompaniesModule,
		ScrapperHelperModule,
		MongooseModule.forFeature([
			{
				name: Scrapper.name,
				schema: ScrapperSchema
			}
		])
	],
	controllers: [ ScrapperController ],
	providers: [ ScrapperService ]
})
export class ScrapperModule {}
