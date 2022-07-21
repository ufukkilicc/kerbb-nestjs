import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateCompanyDto {
  @IsString() readonly name: string;
  @IsOptional()
  @IsString()
  readonly scrape_name: string;
  @IsOptional()
  @IsArray()
  readonly company_tags: ObjectId[];
  @IsOptional()
  @IsNumber()
  readonly job_count: number;
  @IsOptional()
  @IsBoolean()
  readonly is_highlighted: boolean;
  @IsString()
  @IsOptional()
  readonly image_url: string;
  @IsString()
  @IsOptional()
  readonly image_public_id: string;
}
