import { IsBoolean, IsDate, IsString } from 'class-validator';

export class CreateAuditDto {
	@IsDate() readonly create_audit_date: Date;
	@IsString() readonly create_audit_created_by: String;
	@IsDate() readonly create_audit_last_modified_date: Date;
	@IsDate() readonly create_audit_last_modified_by: Date;
	@IsBoolean() readonly create_audit_active: boolean;
}
