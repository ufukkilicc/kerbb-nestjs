import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Tag } from 'src/tags/entities/tag.entitiy';
import * as cloudinary from 'cloudinary';

@Schema()
export class Company extends Document {
  @Prop({
    type: mongoose.Schema.Types.Number,
    required: false,
    default: 1,
  })
  tracking_id: number;
  @Prop({ type: mongoose.Schema.Types.String, required: true }) name: string;
  @Prop({ type: mongoose.Schema.Types.String, required: false })
  scrape_name: string;
  @Prop({ type: mongoose.Schema.Types.Number, required: false, default: 0 })
  job_count: number;
  @Prop({
    type: mongoose.Schema.Types.Boolean,
    required: false,
    default: false,
  })
  is_highlighted: boolean;
  @Prop({
    type: mongoose.Schema.Types.Boolean,
    required: false,
    default: false,
  })
  is_active: boolean;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Tag.name,
    required: false,
    default: [],
  })
  company_tags: Tag[];
  @Prop({ type: mongoose.Schema.Types.Number, required: false, default: 0 })
  company_views: Number;
  @Prop({
    type: mongoose.Schema.Types.Date,
    required: false,
    default: new Date(),
  })
  date: Date;
  @Prop({ type: mongoose.Schema.Types.String, required: false, default: '' })
  logo_image_url: string;
  @Prop({ type: mongoose.Schema.Types.String, required: false, default: '' })
  logo_image_public_id: string;
  @Prop({ type: mongoose.Schema.Types.String, required: false, default: '' })
  cover_image_url: string;
  @Prop({ type: mongoose.Schema.Types.String, required: false, default: '' })
  cover_image_public_id: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

CompanySchema.pre('save', async function (next) {
  var doc = this;
  const docCount = await doc.collection.countDocuments();
  doc.tracking_id = docCount + 1;
  this.scrape_name = this.name
    .replace(/\s/g, '')
    .replace('Ğ', 'g')
    .replace('Ü', 'u')
    .replace('Ş', 's')
    .replace('İ', 'i')
    .replace('I', 'i')
    .replace('Ö', 'o')
    .replace('Ç', 'c')
    .replace('ğ', 'g')
    .replace('ü', 'u')
    .replace('ş', 's')
    .replace('ı', 'i')
    .replace('ö', 'o')
    .replace('ç', 'c')
    .toLocaleLowerCase();
  next();
});
CompanySchema.pre('remove', async function (next) {
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
  if (doc.cover_image_url !== '') {
    const cloudDeleteResponse = await cloudinary.v2.uploader.destroy(
      doc.cover_image_public_id,
      function (error, response) {
        return response;
      },
    );
  }
  next();
});
