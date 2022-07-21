import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Audit } from 'tools/entities/audit.entitiy';

@Schema()
export class ActivityType extends Document {
	@Prop() activity_type_name: string;
	@Prop() audit: Audit;
}

export const ActivityTypeSchema = SchemaFactory.createForClass(ActivityType);
