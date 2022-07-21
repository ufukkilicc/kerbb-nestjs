import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

@Injectable()
export class UploadService {
	constructor() {
		cloudinary.v2.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.CLOUD_API_KEY,
			api_secret: process.env.CLOUD_API_SECRET
		});
	}
	async upload(file: any): Promise<any> {
		let result;
		try {
			await cloudinary.v2.uploader.upload(file.path, function(error, response) {
				result = response;
				return response;
			});
			return await result;
		} catch (error) {
			return await error;
		}
	}
}
