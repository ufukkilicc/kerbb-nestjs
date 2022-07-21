import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { Protocol } from 'src/common/decorators/protocol.decorator';
import { FilterDto } from 'tools/dtos/filter.dto';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @Get()
  async findAll(@Query() query: FilterDto) {
    return await this.jobsService.findAll(query);
  }
  @Get('count')
  async findCount() {
    return await this.jobsService.findCount();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }
  @Roles('Admin')
  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }
  @Roles('Admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }
  @Patch(':id/inc-view')
  incrementView(@Param('id') id: string) {
    return this.jobsService.incrementView(id);
  }
  @Patch(':id/approve-refuse')
  approveJob(@Param('id') id: string) {
    return this.jobsService.approveJob(id);
  }
  // @Patch(':id/dec-view')
  // decrementView(@Param('id') id: string) {
  //   return this.jobsService.decrementView(id);
  // }
  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
  @Roles('Admin')
  @Delete()
  removeAll() {
    return this.jobsService.removeAll();
  }
}
