import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Audit } from 'tools/entities/audit.entitiy';

@Schema()
export class TicketType extends Document {
  @Prop({ type: mongoose.Schema.Types.String }) ticket_type_name: string;
  // @Prop() audit: Audit;
}

export const TicketTypeSchema = SchemaFactory.createForClass(TicketType);
