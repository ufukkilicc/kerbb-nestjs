import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { TagType } from 'src/tag-types/entities/tag-type.entity';

@Schema()
export class Tag extends Document {
  @Prop({
    type: mongoose.Schema.Types.Number,
    required: false,
    default: 1,
  })
  tracking_id: number;
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  tag_name: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: TagType.name,
    required: true,
  })
  tag_type: TagType;
}

export const TagSchema = SchemaFactory.createForClass(Tag);

TagSchema.pre('save', async function (next) {
  var doc = this;
  const docCount = await doc.collection.countDocuments();
  doc.tracking_id = docCount + 1;
});
