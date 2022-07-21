import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResourceService } from 'libs/services/resource.service';
import { Model } from 'mongoose';
import { CreateActivityDto } from 'tools/dtos/activity.dto';
import { UpdateActivityDto } from 'tools/dtos/update-activity.dto';
import { Activity } from 'tools/entities/activity.entitiy';

@Injectable()
export class ActivityService extends ResourceService<Activity, CreateActivityDto, UpdateActivityDto> {
	constructor(@InjectModel(Activity.name) private readonly activityModel: Model<Activity>) {
		super(activityModel);
	}
}
