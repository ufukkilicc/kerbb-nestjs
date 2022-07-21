import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TagTypeFilterDto } from 'tools/dtos/tag-type-filter.dto';
import { CreateTagTypeDto } from './dtos/create-tag-type.dto';
import { UpdateTagTypeDto } from './dtos/update-tag-type.dto';
import { TagTypesService } from './tag-types.service';

@Controller('tag-types')
export class TagTypesController {
  constructor(private readonly tagTypeService: TagTypesService) {}
  @Get()
  findAll(@Query() query: TagTypeFilterDto) {
    return this.tagTypeService.findAll(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagTypeService.findOne(id);
  }
  //   @Roles('Admin')
  @Post()
  create(@Body() createTagTypeDto: CreateTagTypeDto) {
    return this.tagTypeService.create(createTagTypeDto);
  }
  //   @Roles('Admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagTypeDto: UpdateTagTypeDto) {
    return this.tagTypeService.update(id, updateTagTypeDto);
  }
  //   @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagTypeService.remove(id);
  }
  //   @Roles('Admin')
  @Delete()
  removeAll() {
    return this.tagTypeService.removeAll();
  }
}
