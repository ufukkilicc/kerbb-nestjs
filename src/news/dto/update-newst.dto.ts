import { PartialType } from '@nestjs/mapped-types';
import { CreateNewstDto } from './create-news.dto';

export class UpdateNewsDto extends PartialType(CreateNewstDto) {}
