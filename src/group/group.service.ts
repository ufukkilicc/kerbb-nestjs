import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResourceService } from 'libs/services/resource.service';
import { Model } from 'mongoose';
import { CreateGroupDto } from 'src/group/dtos/create-group.dto';
import { Group } from 'src/group/entities/group.entity';
import { UpdateGroupDto } from './dtos/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
  ) {}
  async findAll() {
    return await this.groupModel
      .find({})
      .populate({ path: 'group_roles' })
      .exec();
  }
  async findOne(id: string) {
    const group = await this.groupModel.findOne({ _id: id }).exec();
    if (!group) {
      throw new NotFoundException(`Group ${id} was not found`);
    }
    return group;
  }
  create(createGroupDto: CreateGroupDto) {
    const group = new this.groupModel(createGroupDto);
    return group.save();
  }
  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const existingGroup = await this.groupModel
      .findOneAndUpdate({ _id: id }, { $set: updateGroupDto }, { new: true })
      .exec();

    if (!existingGroup) {
      throw new NotFoundException(`Group ${id} was not found`);
    }
    return existingGroup;
  }
  async remove(id: string) {
    const group = await this.findOne(id);
    return group.remove();
  }
  async removeAll(): Promise<any> {
    return await this.groupModel.deleteMany({}).exec();
  }
}
