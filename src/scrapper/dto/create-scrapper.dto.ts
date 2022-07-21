import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Company } from 'src/companies/entities/company.entitiy';
import { Job } from 'src/jobs/entities/job.entitiy';

export class CreateScrapperDto {
  @IsString() readonly scrapper_title: string;
  @IsOptional()
  @IsObject() readonly scrapper_company: Company;
  @IsBoolean() readonly scrapper_success: boolean;
  @IsOptional()
  @IsString()
  readonly scrapper_error_message: string;
  @IsOptional()
  @IsDate()
  readonly scrapper_start_date: Date;
  @IsOptional()
  @IsDate()
  readonly scrapper_end_date: Date;
  @IsOptional()
  @IsDate()
  readonly scrapper_time_lasts: number;
  @IsOptional()
  @IsNumber()
  readonly scrapper_jobs_found: number;
  @IsOptional()
  @IsNumber()
  readonly scrapper_jobs_added_count: number;
  @IsOptional()
  @IsNumber()
  readonly scrapper_jobs_added: Job[];
  @IsOptional()
  @IsNumber()
  readonly scrapper_jobs_extracted_count: number;
  @IsOptional()
  @IsNumber()
  readonly scrapper_jobs_extracted: Job[];
}
