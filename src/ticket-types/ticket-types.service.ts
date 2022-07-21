import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResourceService } from 'libs/services/resource.service';
import { Model } from 'mongoose';
import { TicketTypeFilterDto } from 'tools/dtos/ticket-type-filter.dto';
import { CreateTicketTypeDto } from './dtos/create-ticket-type.dto';
import { UpdateTicketTypeDto } from './dtos/update-ticket-type.dto';
import { TicketType } from './entities/ticket-type.entitiy';

@Injectable()
export class TicketTypesService {
  constructor(
    @InjectModel(TicketType.name)
    private readonly ticketTypeModel: Model<TicketType>,
  ) {}
  generalSearchQuery = {
    page: 1,
    size: 10,
    sort: 'ASC',
    sort_by: 'ticket_type_name',
  };
  async findAll(query?: TicketTypeFilterDto) {
    const searchValue = await { ...this.generalSearchQuery, ...query };
    if (Object.keys(query).length !== 0) {
      return this.ticketTypeModel
        .find({})
        .limit(Math.max(0, searchValue.size))
        .skip(searchValue.size * (searchValue.page - 1))
        .sort([[`${searchValue.sort_by}`, searchValue.sort]])
        .exec();
    } else {
      return this.ticketTypeModel
        .find({})
        .limit(Math.max(0, searchValue.size))
        .skip(searchValue.size * (searchValue.page - 1))
        .sort([[`${searchValue.sort_by}`, searchValue.sort]])
        .exec();
    }
  }
  async findOne(id: string) {
    const ticketType = await this.ticketTypeModel.findOne({ _id: id }).exec();
    if (!ticketType) {
      throw new NotFoundException(`Ticket Type ${id} was not found`);
    }
    return ticketType;
  }
  create(createTicketTypeDto: CreateTicketTypeDto) {
    const ticketType = new this.ticketTypeModel(createTicketTypeDto);
    return ticketType.save();
  }
  async update(id: string, updateTicketTypeDto: UpdateTicketTypeDto) {
    const existingTicketType = await this.ticketTypeModel
      .findOneAndUpdate(
        { _id: id },
        { $set: updateTicketTypeDto },
        { new: true },
      )
      .exec();

    if (!existingTicketType) {
      throw new NotFoundException(`Ticket Type ${id} was not found`);
    }
    return existingTicketType;
  }
  async remove(id: string) {
    const ticketType = await this.findOne(id);
    return ticketType.remove();
  }
  async removeAll(): Promise<any> {
    return await this.ticketTypeModel.deleteMany({}).exec();
  }
}
