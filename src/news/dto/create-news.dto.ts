import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateNewstDto {
  @IsString() readonly news_title: string;
  @IsString() readonly news_content: string;
  @IsString()
  @IsOptional()
  readonly image_url: string;
  @IsString()
  @IsOptional()
  readonly image_public_id: string;
  @IsOptional()
  @IsArray()
  readonly news_tags: ObjectId[];
}
