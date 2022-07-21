import { IsArray, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { Role } from 'src/role/entities/role.entitiy';

export class CreateGroupDto {
	@IsString() readonly group_name: string;
	@IsString() readonly group_description: string;
	@IsArray() readonly group_roles: ObjectId[];
}
