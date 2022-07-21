import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { Audit } from 'tools/entities/audit.entitiy';
import { Group } from 'src/group/entities/group.entity';
import { Role } from 'src/role/entities/role.entitiy';

export class CreateUserDto {
  @IsString() readonly user_name: string;
  @IsString() readonly user_surname: string;
  @IsString() readonly user_email: string;
  @IsString() readonly user_password: string;
  @IsOptional()
  @IsArray()
  readonly user_roles: ObjectId[];
  @IsOptional()
  @IsArray()
  readonly user_groups: ObjectId[];
  // @IsOptional()
  // @IsObject()
  // readonly audit: Audit;
}
