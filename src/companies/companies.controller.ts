import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorators/role.decorator';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { of } from 'rxjs';
import { Response } from 'express';
import { CompanyFilterDto } from 'tools/dtos/company-filter.dto';
const fs = require('fs');

const storage_options = diskStorage({
  destination: './upload/companies/',
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}${extname(file.originalname)}`);
  },
});

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  @Get()
  async findAll(@Query() query: CompanyFilterDto) {
    return await this.companiesService.findAll(query);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const company = await this.companiesService.findOne(id);
    return await company;
  }
  @Post()
  create(@Body() createJobDto: CreateCompanyDto) {
    return this.companiesService.create(createJobDto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateJobDto);
  }
  @Patch(':id/inc-view')
  incrementView(@Param('id') id: string) {
    return this.companiesService.incrementView(id);
  }
  @Patch(':id/approve-refuse')
  approveCompany(@Param('id') id: string) {
    return this.companiesService.approveCompany(id);
  }
  @Patch(':id/highlight')
  highlightCompany(@Param('id') id: string) {
    return this.companiesService.highlightCompany(id);
  }
  @Patch(':id/highlight-order')
  highlightOrderCompany(
    @Param('id') id: string,
    @Body('highlight_order') highlightOrder,
  ) {
    return this.companiesService.highlightOrderCompany(id, highlightOrder);
  }
  @Patch(':id/activate-deactivate')
  activateCompany(@Param('id') id: string) {
    return this.companiesService.activateCompany(id);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
  @Delete()
  removeAll() {
    return this.companiesService.removeAll();
  }

  @Post(':id/upload-logo')
  @UseInterceptors(FileInterceptor('file', { storage: storage_options }))
  async uploadLogoImageFile(
    @UploadedFile('file') file: Express.Multer.File,
    @Param('id') id: string,
  ): Promise<any> {
    return await this.companiesService.uploadLogo(file, id);
  }
  @Post(':id/upload-cover')
  @UseInterceptors(FileInterceptor('file', { storage: storage_options }))
  async uploadCoverImageFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ): Promise<any> {
    return await this.companiesService.uploadCover(file, id);
  }
}
