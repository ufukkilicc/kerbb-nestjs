import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Roles } from 'src/common/decorators/role.decorator';
import { CreateRoleDto } from 'src/role/dtos/create-role.dto';
import { RoleFilterDto } from 'tools/dtos/role-filter.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}
	@Get()
	findAll(@Query() query:RoleFilterDto) {
		return this.roleService.findAll(query);
	}
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.roleService.findOne(id);
	}
	@Roles('Admin')
	@Post()
	create(@Body() createRoleDto: CreateRoleDto) {
		return this.roleService.create(createRoleDto);
	}
	@Roles('Admin')
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
		return this.roleService.update(id, updateRoleDto);
	}
	@Roles('Admin')
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.roleService.remove(id);
	}
	@Roles('Admin')
	@Delete()
	removeAll() {
		return this.roleService.removeAll();
	}
}
