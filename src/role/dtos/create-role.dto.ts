import { IsString } from 'class-validator';

export class CreateRoleDto {
	@IsString() readonly role_name: String;
}
