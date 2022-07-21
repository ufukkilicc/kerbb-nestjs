import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagType, TagTypeSchema } from './entities/tag-type.entity';
import { TagTypesController } from './tag-types.controller';
import { TagTypesService } from './tag-types.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TagType.name,
        schema: TagTypeSchema,
      },
    ]),
  ],
  controllers: [TagTypesController],
  providers: [TagTypesService],
  exports: [TagTypesService],
})
export class TagTypesModule {}
