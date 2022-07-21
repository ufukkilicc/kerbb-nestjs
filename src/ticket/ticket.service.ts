import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResourceService } from 'libs/services/resource.service';
import { Model } from 'mongoose';
import { TicketFilterDto } from 'tools/dtos/ticket-filter.dto';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { UpdateTicketDto } from './dtos/update-ticket.dto';
import { Ticket } from './entities/ticket.entitiy';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
  ) {}
  generalSearchQuery = {
    page: 1,
    size: 10,
    sort: 'ASC',
    sort_by: 'ticket_start_date',
  };
  async findAll(query?: TicketFilterDto) {
    const searchValue = await { ...this.generalSearchQuery, ...query };
    if (Object.keys(query).length !== 0) {
      return await this.ticketModel
        .find({})
        .limit(Math.max(0, searchValue.size))
        .skip(searchValue.size * (searchValue.page - 1))
        .sort([[`${searchValue.sort_by}`, searchValue.sort]])
        .populate('ticket_type')
        .populate({
          path: 'ticket_responsible',
          select: '-user_password',
          populate: [
            { path: 'user_roles' },
            { path: 'user_groups', populate: 'group_roles' },
          ],
        })
        .populate({
          path: 'ticket_created_by',
          select: '-user_password',
          populate: [
            { path: 'user_roles' },
            { path: 'user_groups', populate: 'group_roles' },
          ],
        })
        .exec();
    } else {
      return await this.ticketModel
        .find({})
        .limit(Math.max(0, searchValue.size))
        .skip(searchValue.size * (searchValue.page - 1))
        .sort([[`${searchValue.sort_by}`, searchValue.sort]])
        .populate('ticket_type')
        .populate({
          path: 'ticket_responsible',
          select: '-user_password',
          populate: [
            { path: 'user_roles' },
            { path: 'user_groups', populate: 'group_roles' },
          ],
        })
        .populate({
          path: 'ticket_created_by',
          select: '-user_password',
          populate: [
            { path: 'user_roles' },
            { path: 'user_groups', populate: 'group_roles' },
          ],
        })
        .exec();
    }
  }
  async findOne(id: string) {
    const ticket = await this.ticketModel.findOne({ _id: id }).exec();
    if (!ticket) {
      throw new NotFoundException(`Ticket ${id} was not found`);
    }
    return ticket;
  }
  create(createTicketDto: CreateTicketDto) {
    const ticket = new this.ticketModel(createTicketDto);
    return ticket.save();
  }
  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const existingTicket = await this.ticketModel
      .findOneAndUpdate({ _id: id }, { $set: updateTicketDto }, { new: true })
      .exec();

    if (!existingTicket) {
      throw new NotFoundException(`Ticket ${id} was not found`);
    }
    return existingTicket;
  }
  async remove(id: string) {
    const ticket = await this.findOne(id);
    return ticket.remove();
  }
  async removeAll(): Promise<any> {
    return await this.ticketModel.deleteMany({}).exec();
  }
}
