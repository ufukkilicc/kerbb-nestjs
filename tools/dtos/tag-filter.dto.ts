import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class TagFilterDto {
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
  search_tag_type_by: string;
  @IsOptional()
  @IsString()
  tag_type: string;
}
