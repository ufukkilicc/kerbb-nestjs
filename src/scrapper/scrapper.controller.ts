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
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { ScrapperFilterDto } from 'tools/dtos/scrapper-filter.dto';
import { CreateScrapperDto } from './dto/create-scrapper.dto';
import { UpdateScrapperDto } from './dto/update-scrapper.dto';
import { ScrapperService } from './scrapper.service';

@Controller('scrapper')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Roles('Admin')
  @Get('/scrape-all')
  async scrapeAll() {
    return await this.scrapperService.scrapeAll();
  }
  @Roles('Admin')
  @Get(':scrapper')
  scrapeOne(@Param('scrapper') scrapper: string) {
    return this.scrapperService.scrapeOne(scrapper, false);
  }
  @Get()
  findAll(@Query() query: ScrapperFilterDto) {
    return this.scrapperService.findAll(query);
  }
  @Roles('Admin')
  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return this.scrapperService.findOne(id);
  }
  @Roles('Admin')
  @Post()
  create(@Body() createScrapperDto: CreateScrapperDto) {
    return this.scrapperService.create(createScrapperDto);
  }
  @Roles('Admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScrapperDto: UpdateScrapperDto,
  ) {
    return this.scrapperService.update(id, updateScrapperDto);
  }
  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scrapperService.remove(id);
  }
  @Roles('Admin')
  @Delete()
  removeAll() {
    return this.scrapperService.removeAll();
  }
}
