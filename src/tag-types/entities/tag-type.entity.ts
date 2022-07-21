import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class TagType extends Document {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  tag_type_name: string;
}

export const TagTypeSchema = SchemaFactory.createForClass(TagType);
