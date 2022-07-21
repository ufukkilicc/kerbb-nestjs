import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './activity.dto';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {}
