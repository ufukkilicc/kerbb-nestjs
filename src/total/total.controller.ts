import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { TotalService } from './total.service';

@Controller('total')
export class TotalController {
	constructor(private readonly totalService: TotalService) {}

	@Get()
	async findAll(): Promise<any> {
		return await this.totalService.findAll();
	}
}
