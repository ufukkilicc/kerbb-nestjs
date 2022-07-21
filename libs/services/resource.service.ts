import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Audit } from 'tools/entities/audit.entitiy';
import { Filter } from 'tools/entities/filter.entitiy';

export class ResourceService<T extends any, C extends any, U extends any> {
	constructor(protected readonly mongoModel: Model<T>) {}

	generalSearchQuery = {
		page: 1,
		size: 10,
		sort: 'ASC',
		sort_By: '_id',
		query_Text: '',
		search_By: 'name'
	};

	async findAll(query?: Filter): Promise<any[]> {
		const count = await this.mongoModel.countDocuments({}).exec();

		return await this.mongoModel.find().exec();
		// return await [
		// 	{
		// 		success: true,
		// 		size: this.generalSearchQuery.size,
		// 		total: count,
		// 		data
		// 	}
		// ];
	}
	async findOne(id: string) {
		const existingModel = await this.mongoModel.findOne({ _id: id }).exec();
		if (!existingModel) {
			throw new NotFoundException(`News ${id} was not found`);
		}
		return existingModel;
	}
	create(model: C): Promise<T> {
		// const audit = new Audit();
		// audit.audit_active = true;
		// audit.audit_created_by = 'Admin';
		// audit.audit_created_date = new Date();

		const createdModel = new this.mongoModel(model);

		return createdModel.save();
	}
	async update(id: string, dto: U) {
		const existingNews = await this.mongoModel.findOneAndUpdate({ _id: id }, { $set: dto }, { new: true }).exec();

		if (!existingNews) {
			throw new NotFoundException(`News ${id} was not found`);
		}
		return existingNews;
	}
	async remove(id: string) {
		const news = await this.findOne(id);
		return news.remove();
	}
	async removeAll(): Promise<any> {
		return await this.mongoModel.deleteMany({}).exec();
	}
}
