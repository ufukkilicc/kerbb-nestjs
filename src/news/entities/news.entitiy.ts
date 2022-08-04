import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Tag } from 'src/tags/entities/tag.entitiy';
import * as cloudinary from 'cloudinary';

@Schema()
export class News extends Document {
  @Prop({
    type: mongoose.Schema.Types.Number,
    required: false,
    default: 1,
  })
  tracking_id: number;
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  news_title: string;
  @Prop({ type: mongoose.Schema.Types.Number, required: false, default: 0 })
  news_views: Number;
  @Prop({
    type: mongoose.Schema.Types.Date,
    required: false,
    default: new Date(),
  })
  news_date: Date;
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  news_content: string;
  @Prop({ type: mongoose.Schema.Types.String, required: false, default: '' })
  image_url: string;
  @Prop({ type: mongoose.Schema.Types.String, required: false, default: '' })
  image_public_id: string;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Tag.name,
    required: false,
    default: [],
  })
  news_tags: Tag[];
}

export const NewsSchema = SchemaFactory.createForClass(News);

NewsSchema.pre('save', async function (next) {
  var doc = this;
  const docCount = await doc.collection.countDocuments();
  doc.tracking_id = docCount + 1;
  next();
});
NewsSchema.pre('remove', async function (next) {
  var doc = this;
  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
  if (doc.image_url !== '') {
    const cloudDeleteResponse = await cloudinary.v2.uploader.destroy(
      doc.image_public_id,
      function (error, response) {
        return response;
      },
    );
  }
  next();
});
