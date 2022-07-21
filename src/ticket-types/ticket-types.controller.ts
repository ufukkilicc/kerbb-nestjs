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
import { Roles } from 'src/common/decorators/role.decorator';
import { TicketTypeFilterDto } from 'tools/dtos/ticket-type-filter.dto';
import { CreateTicketTypeDto } from './dtos/create-ticket-type.dto';
import { UpdateTicketTypeDto } from './dtos/update-ticket-type.dto';
import { TicketTypesService } from './ticket-types.service';

@Controller('ticket-types')
export class TicketTypesController {
  constructor(private readonly ticketTypeService: TicketTypesService) {}
  @Get()
  findAll(@Query() query: TicketTypeFilterDto) {
    return this.ticketTypeService.findAll(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketTypeService.findOne(id);
  }
  @Roles('Admin', 'Developer')
  @Post()
  create(@Body() createTicketTypeDto: CreateTicketTypeDto) {
    return this.ticketTypeService.create(createTicketTypeDto);
  }
  @Roles('Admin', 'Developer')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTicketTypeDto: UpdateTicketTypeDto,
  ) {
    return this.ticketTypeService.update(id, updateTicketTypeDto);
  }
  @Roles('Admin', 'Developer')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketTypeService.remove(id);
  }
  @Roles('Admin', 'Developer')
  @Delete()
  removeAll() {
    return this.ticketTypeService.removeAll();
  }
}
