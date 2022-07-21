import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

Schema();
export class Filter extends Document {
	@Prop() page: number;
	@Prop() size: number;
	@Prop() sort: string;
	@Prop() sort_by: string;
	@Prop() query_text: string;
	@Prop() search_by: string;
}

