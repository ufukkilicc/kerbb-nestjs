import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { CreateGroupDto } from 'src/group/dtos/create-group.dto';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { GroupService } from './group.service';

@Controller('groups')
export class GroupController {
	constructor(private readonly groupService: GroupService) {}
	@Public()
	@Get()
	findAll() {
		return this.groupService.findAll();
	}
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.groupService.findOne(id);
	}
	@Roles('Admin')
	@Post()
	create(@Body() createGroupDto: CreateGroupDto) {
		return this.groupService.create(createGroupDto);
	}
	@Roles('Admin')
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
		return this.groupService.update(id, updateGroupDto);
	}
	@Roles('Admin')
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.groupService.remove(id);
	}
	@Delete()
	@Roles('Admin')
	deleteAll() {
		return this.groupService.removeAll();
	}
}
