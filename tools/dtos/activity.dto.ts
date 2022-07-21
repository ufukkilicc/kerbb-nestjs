import { IsString } from 'class-validator';

export class CreateActivityDto {
	@IsString() readonly create_activity_name: string;
}
