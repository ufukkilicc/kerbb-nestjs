import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/role.decorator';
import { PublishersFilterDto } from 'tools/dtos/publishers-filter.dto';
import { CreatePublisherDto } from './dtos/create-publisher.dto';
import { UpdatePublisherDto } from './dtos/update-publisher.dto';
import { PublisherService } from './publisher.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
const fs = require('fs');

const storage_options = diskStorage({
  destination: './upload/companies/',
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}${extname(file.originalname)}`);
  },
});

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}
  @Get()
  findAll(@Query() query: PublishersFilterDto) {
    return this.publisherService.findAll(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publisherService.findOne(id);
  }
  @Roles('Admin')
  @Post()
  create(@Body() createPublisherDto: CreatePublisherDto) {
    return this.publisherService.create(createPublisherDto);
  }
  @Roles('Admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublisherDto: UpdatePublisherDto,
  ) {
    return this.publisherService.update(id, updatePublisherDto);
  }
  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publisherService.remove(id);
  }
  @Delete()
  @Roles('Admin')
  deleteAll() {
    return this.publisherService.removeAll();
  }
  @Post(':id/upload-logo')
  @UseInterceptors(FileInterceptor('file', { storage: storage_options }))
  async uploadLogoImageFile(
    @UploadedFile('file') file: Express.Multer.File,
    @Param('id') id: string,
  ): Promise<any> {
    return await this.publisherService.uploadLogo(file, id);
  }
}
