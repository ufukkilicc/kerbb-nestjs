import { IsObject, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateTagDto {
  @IsString() readonly tag_name: String;
  @IsObject() readonly tag_type: ObjectId;
}
