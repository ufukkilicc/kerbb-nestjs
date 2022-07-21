import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId, Types } from 'mongoose';
import { User } from 'src/users/entitiy/user.entitiy';
import { TicketType } from 'src/ticket-types/entities/ticket-type.entitiy';

@Schema()
export class Ticket extends Document {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  ticket_name: string;
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  ticket_description: string;
  @Prop({ type: mongoose.Schema.Types.Boolean, required: false, default: true })
  ticket_active: boolean;
  @Prop({
    type: mongoose.Schema.Types.Date,
    required: false,
    default: new Date(),
  })
  ticket_start_date: Date;
  @Prop({ type: mongoose.Schema.Types.Date, required: false })
  ticket_end_date: Date;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: TicketType.name,
    required: true,
  })
  ticket_type: ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  ticket_responsible: ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  ticket_created_by: ObjectId;
  // @Prop() ticket_activities: Activity[];
  // @Prop() audit: Audit;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
