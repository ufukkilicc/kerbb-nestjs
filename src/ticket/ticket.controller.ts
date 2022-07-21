import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ObjectId } from 'mongoose';
import { Roles } from 'src/common/decorators/role.decorator';
import { TicketGuard } from 'src/common/guards/ticket.guard';
import { User } from 'src/users/entitiy/user.entitiy';
import { TicketFilterDto } from 'tools/dtos/ticket-filter.dto';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { UpdateTicketDto } from './dtos/update-ticket.dto';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}
  @Get()
  findAll(@Query() query: TicketFilterDto) {
    return this.ticketService.findAll(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }
  @Roles('Admin', 'Developer')
  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Req() request: Request) {
    const user = request['user'].user;
    const dto: CreateTicketDto = {
      ticket_name: createTicketDto.ticket_name,
      ticket_description: createTicketDto.ticket_description,
      ticket_type: createTicketDto.ticket_type,
      ticket_responsible: createTicketDto.ticket_responsible,
      ticket_created_by: user,
      ticket_active: undefined,
      ticket_start_date: undefined,
      ticket_end_date: undefined,
    };
    return this.ticketService.create(dto);
  }
  @Roles('Admin', 'Developer')
  @Patch(':id')
  // @UseGuards(TicketGuard)
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(id, updateTicketDto);
  }
  @Roles('Admin', 'Developer')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }
  @Roles('Admin', 'Developer')
  @Delete()
  removeAll() {
    return this.ticketService.removeAll();
  }
}
