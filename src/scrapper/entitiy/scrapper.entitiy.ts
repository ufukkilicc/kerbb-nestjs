import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Company } from 'src/companies/entities/company.entitiy';
import { Job } from 'src/jobs/entities/job.entitiy';

@Schema()
export class Scrapper extends Document {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  scrapper_title: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: Company.name,
  })
  scrapper_company: Company;
  @Prop({ type: mongoose.Schema.Types.Boolean, required: true })
  scrapper_success: boolean;
  @Prop({ type: mongoose.Schema.Types.String, required: false, default: '' })
  scrapper_error_message: string;
  @Prop({ type: mongoose.Schema.Types.Date, required: false })
  scrapper_start_date: Date;
  @Prop({ type: mongoose.Schema.Types.Date, required: false })
  scrapper_end_date: Date;
  @Prop({ type: mongoose.Schema.Types.Number, required: false })
  scrapper_time_lasts: number;
  @Prop({ type: mongoose.Schema.Types.Number, required: false, default: 0 })
  scrapper_jobs_found: number;
  @Prop({ type: mongoose.Schema.Types.Number, required: false, default: 0 })
  scrapper_jobs_added_count: number;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Job.name,
    required: false,
  })
  scrapper_jobs_added: Job[];
  @Prop({ type: mongoose.Schema.Types.Number, required: false, default: 0 })
  scrapper_jobs_extracted_count: number;
  @Prop({
    type: mongoose.Schema.Types.Array,
    ref: Job.name,
    required: false,
    default: 0,
  })
  scrapper_jobs_extracted: Job[];
}

export const ScrapperSchema = SchemaFactory.createForClass(Scrapper);
