import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ScrapperFilterDto {
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
  @IsBoolean()
  success: boolean;
}
