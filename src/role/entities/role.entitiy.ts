import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Audit } from 'tools/entities/audit.entitiy';

@Schema()
export class Role extends Document {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  role_name: string;
  // @Prop() audit: Audit;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
