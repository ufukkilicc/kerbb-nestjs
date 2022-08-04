import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsNumber()
  page: number;
  @IsOptional()
  @IsNumber()
  size: number;
  @IsOptional()
  @IsString()
  sort: string;
  @IsOptional()
  @IsString()
  sort_by: string;
  @IsOptional()
  @IsString()
  query_text: string;
  @IsOptional()
  @IsString()
  location_query_text: string;
  @IsOptional()
  @IsString()
  search_title_by: string;
  @IsOptional()
  @IsString()
  search_location_by: string;
  @IsOptional()
  @IsString()
  search_company_by: string;
  @IsOptional()
  @IsString()
  search_scrape_by: string;
}