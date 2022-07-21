import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from 'src/group/entities/group.entity';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Group',
				schema: GroupSchema
			}
		])
	],
	controllers: [ GroupController ],
	providers: [ GroupService ],
	exports: [ GroupService ]
})
export class GroupModule {}
