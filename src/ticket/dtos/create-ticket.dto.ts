import { IsBoolean, IsDate, IsObject, IsOptional, IsString } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { ObjectId } from 'mongoose';

export class CreateTicketDto {
  @IsString() readonly ticket_name: String;
  @IsString() readonly ticket_description: String;
  @IsOptional()
  @IsBoolean()
  readonly ticket_active: Boolean;
  @IsOptional()
  @IsDate()
  readonly ticket_start_date: Date;
  @IsOptional()
  @IsDate()
  readonly ticket_end_date: Date;
  @IsObject() readonly ticket_type: ObjectId;
  @IsObject() readonly ticket_responsible: ObjectId;
  @IsOptional()
  @IsObject() readonly ticket_created_by: ObjectId;
  // @IsArray() readonly create_ticket_activities: Activity[];
  // @IsObject() readonly audit: Audit;
}
