import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CompanyFilterDto {
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
  search_name_by: string;
  @IsOptional()
  @IsString()
  search_scrape_by: string;
  @IsOptional()
  @IsBoolean()
  search_highlighted_by: string;
  @IsOptional()
  @IsBoolean()
  is_highlighted: boolean;
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
  @IsOptional()
  @IsString()
  state: string;
}

const optionalBooleanMapper = new Map([
  ['undefined', undefined],
  ['true', true],
  ['false', false],
]);
