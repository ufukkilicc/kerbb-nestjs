import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { of } from 'rxjs';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { CreateNewstDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-newst.dto';
import { NewsService } from './news.service';
const fs = require('fs');

const storage_options = diskStorage({
  destination: './upload/news/',
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}${extname(file.originalname)}`);
  },
});

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Get()
  findAll() {
    return this.newsService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }
  @Roles('Admin', 'Developer')
  @Post()
  create(@Body() createNewsDto: CreateNewstDto) {
    return this.newsService.create(createNewsDto);
  }
  @Roles('Admin', 'Developer')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }
  @Roles('Admin', 'Developer')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
  @Roles('Admin', 'Developer')
  @Delete()
  removeAll() {
    return this.newsService.removeAll();
  }
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file', { storage: storage_options }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ): Promise<any> {
    return await this.newsService.upload(file, id);
  }
  // @Get(':id/download')
  // async downloadFile(
  //   @Res() res: Response,
  //   @Param('id') id: string,
  // ): Promise<any> {
  //   const news = await this.findOne(id);
  //   if (news.news_image) {
  //     return of(
  //       res.sendFile(join(process.cwd(), './upload/news/' + news.news_image)),
  //     );
  //   } else {
  //     return res.json({
  //       success: false,
  //       message: 'This news has no image',
  //     });
  //   }
  // }
}
