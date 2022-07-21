import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';

const storage_options = diskStorage({
	destination: './upload',
	filename: (req, file, callback) => {
		callback(null, `${Date.now()}.${extname(file.originalname)}`);
	}
});

@Controller('upload')
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file', { storage: storage_options }))
	async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
		return this.uploadService.upload(file);
	}
}
