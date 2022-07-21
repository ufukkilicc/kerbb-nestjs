import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateActivityDto } from 'tools/dtos/activity.dto';
import { UpdateActivityDto } from 'tools/dtos/update-activity.dto';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}
    @Public()
	@Get()
	findAll() {
		return this.activityService.findAll();
	}
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.activityService.findOne(id);
	}
	@Post()
	create(@Body() createActivityDto: CreateActivityDto) {
		return this.activityService.create(createActivityDto);
	}
	@Patch(':id')
	update(@Param('id') id: string, @Body() UpdateActivityDto:UpdateActivityDto) {
		return this.activityService.update(id, UpdateActivityDto);
	}
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.activityService.remove(id);
	}
}
