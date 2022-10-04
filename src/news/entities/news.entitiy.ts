import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Tag } from 'src/tags/entities/tag.entitiy';
import * as cloudinary from 'cloudinary';
import { Publisher } from 'src/publisher/entities/publisher.entity';

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
    default: function () {
      const str = new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      });

      const [dateValues, timeValues] = str.split(' ');
      console.log(dateValues); // 👉️ "09/24/2022"
      console.log(timeValues); // 👉️ "07:30:14"

      const [day, month, year] = dateValues.split('.');
      const [hours, minutes, seconds] = timeValues.split(':');

      const date = new Date(
        +year,
        +month - 1,
        +day,
        +hours,
        +minutes,
        +seconds,
      );

      //  👇️️ Sat Sep 24 2022 07:30:14
      return date;
    },
  })
  news_date: Date;
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  news_content: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: Publisher.name,
    default: null,
  })
  news_publisher: Publisher;
  @Prop({ type: mongoose.Schema.Types.String, required: false, default: '' })
  image_url: string;
  @Prop({ type: mongoose.Schema.Types.String, required: false, default: '' })
  image_public_id: string;
  @Prop({ type: mongoose.Schema.Types.String, required: false, default: '' })
  image_url_secondary: string;
  @Prop({ type: mongoose.Schema.Types.String, required: false, default: '' })
  image_public_id_secondary: string;
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
  var newTrackingId = docCount + 1;
  const existingDocument = doc.collection.findOne({
    tracking_id: newTrackingId,
  });
  if (!existingDocument) {
    newTrackingId++;
  }
  doc.tracking_id = newTrackingId;
  let newsContent = doc.news_content;
  doc.news_content = newsContent.replace(/<a /g ,'<a target="_blank" rel="noreferer "')
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
  if (doc.image_url_secondary !== '') {
    const cloudDeleteResponse = await cloudinary.v2.uploader.destroy(
      doc.image_public_id_secondary,
      function (error, response) {
        return response;
      },
    );
  }
  next();
});
