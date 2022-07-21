import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { Company } from 'src/companies/entities/company.entitiy';

export class CreateJobDto {
  @IsString() readonly job_title: string;
  @IsString() readonly job_link: string;
  @IsOptional()
  @IsString()
  readonly job_location: string;
  @IsOptional()
  @IsBoolean()
  readonly is_approved: boolean;
  @IsString() readonly company: string;
  @IsOptional()
  @IsObject() readonly job_company: Company;
  @IsOptional()
  @IsString()
  readonly scrape_name: string;
  @IsOptional()
  @IsArray()
  readonly job_tags: ObjectId[];
}
