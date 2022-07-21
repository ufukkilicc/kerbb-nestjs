import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId, Types } from 'mongoose';
import { User } from 'src/users/entitiy/user.entitiy';

@Schema()
export class Audit extends Document {
  @Prop({ type: () => Date, required: false, default: new Date() })
  audit_created_date: Date;
  @Prop({ type: () => Types.ObjectId, ref: User.name, required: true })
  audit_created_by: ObjectId;
  @Prop() audit_last_modified_date: Date;
  @Prop() audit_last_modified_by: Date;
  @Prop() audit_active: boolean;
}

export const AuditSchema = SchemaFactory.createForClass(Audit);
