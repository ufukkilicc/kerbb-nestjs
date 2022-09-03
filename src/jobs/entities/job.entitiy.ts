import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Number } from 'mongoose';
import { Company } from 'src/companies/entities/company.entitiy';
import { Tag } from 'src/tags/entities/tag.entitiy';

@Schema()
export class Job extends Document {
  @Prop({
    type: mongoose.Schema.Types.Number,
    required: false,
    default: 1,
  })
  tracking_id: number;
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  job_title: string;
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  job_link: string;
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  job_location: string;
  @Prop({ type: mongoose.Schema.Types.String, required: true }) company: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Company.name,
  })
  job_company: Company;
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  scrape_name: string;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Tag.name,
    required: false,
    default: [],
  })
  job_tags: Tag[];
  @Prop({
    type: mongoose.Schema.Types.Boolean,
    required: false,
    default: false,
  })
  is_approved: boolean;
  @Prop({
    type: mongoose.Schema.Types.Boolean,
    required: false,
    default: false,
  })
  is_highlighted: boolean;
  @Prop({
    type: mongoose.Schema.Types.Number,
    required: false,
    default: null,
    unique: false,
  })
  highlight_order: number;
  @Prop({ type: mongoose.Schema.Types.Number, required: false, default: 0 })
  job_views: Number;
  @Prop({
    type: mongoose.Schema.Types.Date,
    required: false,
    default: new Date(),
  })
  date: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.pre('save', async function (next) {
  var doc = this;
  const docCount = await doc.collection.countDocuments();
  doc.tracking_id = docCount + 1;
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
