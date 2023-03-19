import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import * as cloudinary from 'cloudinary';

@Schema()
export class Publisher extends Document {
  @Prop({
    type: mongoose.Schema.Types.Number,
    required: false,
    default: 1,
  })
  tracking_id: number;
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  publisher_name: string;
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  publisher_redirect_link: string;
  @Prop({
    type: mongoose.Schema.Types.Date,
    required: false,
    default: function () {
      const str = new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
      });

      const [dateValues, timeValues] = str.split(' ');
      (dateValues); // 👉️ "09/24/2022"
      (timeValues); // 👉️ "07:30:14"

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
  publisher_date: Date;
  @Prop({ type: mongoose.Schema.Types.String, required: false, default: '' })
  logo_image_url: string;
  @Prop({ type: mongoose.Schema.Types.String, required: false, default: '' })
  logo_image_public_id: string;
}

export const PublisherSchema = SchemaFactory.createForClass(Publisher);

PublisherSchema.pre('save', async function (next) {
  var doc = this;
  const docCount = await doc.collection.countDocuments();
  var newTrackingId = docCount + 1;
  const existingDocument = await doc.collection.findOne({
    tracking_id: newTrackingId,
  });
  (existingDocument);
  if (existingDocument) {
    newTrackingId++;
  }
  doc.tracking_id = newTrackingId;
  // this.scrape_name = this.company
  //   .replace(/\s/g, '')
  //   .replace('Ğ', 'g')
  //   .replace('Ü', 'u')
  //   .replace('Ş', 's')
  //   .replace('İ', 'i')
  //   .replace('I', 'i')
  //   .replace('Ö', 'o')
  //   .replace('Ç', 'c')
  //   .replace('ğ', 'g')
  //   .replace('ü', 'u')
  //   .replace('ş', 's')
  //   .replace('ı', 'i')
  //   .replace('ö', 'o')
  //   .replace('ç', 'c')
  //   .toLocaleLowerCase();
  next();
});

PublisherSchema.pre('remove', async function (next) {
  var doc = this;
  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
  if (doc.logo_image_url !== '') {
    const cloudDeleteResponse = await cloudinary.v2.uploader.destroy(
      doc.logo_image_public_id,
      function (error, response) {
        return response;
      },
    );
  }
  next();
});
