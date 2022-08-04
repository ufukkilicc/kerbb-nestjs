import { Module } from '@nestjs/common';
import { ScrapperModule } from 'src/scrapper/scrapper.module';
import { TasksService } from './tasksService.service';

@Module({
  imports: [ScrapperModule],
  providers: [TasksService],
})
export class TasksModule {}
