import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Number } from 'mongoose';
import { Company } from 'src/companies/entities/company.entitiy';
import { Tag } from 'src/tags/entities/tag.entitiy';
import * as moment from 'moment-timezone';

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
  date: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.pre('save', async function (next) {
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
