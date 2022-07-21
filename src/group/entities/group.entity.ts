import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Audit } from 'tools/entities/audit.entitiy';
import { Role } from '../../role/entities/role.entitiy';

@Schema()
export class Group extends Document {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  group_name: string;
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  group_description: string;
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Role.name, default: [] })
  group_roles: Role;
  // @Prop() audit: Audit;
}

export class GroupModel {
  _id: string;
  group_name: string;
  group_description: string;
  group_roles: String[];
  audit: Audit;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
