import {
  IsArray,
  IsDate,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { Publisher } from 'src/publisher/entities/publisher.entity';

export class CreateNewstDto {
  @IsString() readonly news_title: string;
  @IsString() readonly news_content: string;
  @IsString()
  @IsOptional()
  readonly image_url: string;
  @IsString()
  @IsOptional()
  readonly image_public_id: string;
  @IsObject()
  @IsOptional()
  readonly news_publisher: Object;
  @IsOptional()
  @IsArray()
  readonly news_tags: ObjectId[];
}
