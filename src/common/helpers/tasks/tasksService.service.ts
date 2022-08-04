import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScrapperService } from 'src/scrapper/scrapper.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly scrappersService: ScrapperService) {}

  @Cron('0 0 19 * * *')
  handleCron() {
    this.scrappersService.scrapeAll();
  }
}
