import { IsString } from 'class-validator';

export class CreatePublisherDto {
  @IsString() readonly publisher_name: string;
  @IsString() readonly publisher_redirect_link: string;
}
