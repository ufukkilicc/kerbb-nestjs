import { IsObject, IsString } from 'class-validator';
import { CreateAuditDto } from './audit.dto';

export class CreateActivityTypeDto {
	@IsString() readonly create_activity_type_name: string;
	@IsObject() readonly audit: CreateAuditDto;
}
