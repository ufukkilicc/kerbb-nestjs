import { IsString } from 'class-validator';

export class CreateTagTypeDto {
  @IsString() readonly tag_type_name: String;
}
