import { Module } from '@nestjs/common';
import { ResourceService } from './services/resource.service';

@Module({
	providers: [ ResourceService ]
})
export class LibsModule {}
