import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Audit } from 'tools/entities/audit.entitiy';
import { ActivityType } from './activity-type.entitiy';

@Schema()
export class Activity extends Document {
	@Prop() activity_name: string;
	@Prop() activity_type: ActivityType;
	@Prop() audit: Audit;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
