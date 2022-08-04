import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class TicketFilterDto {
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
}