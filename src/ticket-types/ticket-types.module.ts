import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketType, TicketTypeSchema } from './entities/ticket-type.entitiy';
import { TicketTypesController } from './ticket-types.controller';
import { TicketTypesService } from './ticket-types.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TicketType.name,
        schema: TicketTypeSchema,
      },
    ]),
  ],
  controllers: [TicketTypesController],
  providers: [TicketTypesService],
})
export class TicketTypesModule {}
