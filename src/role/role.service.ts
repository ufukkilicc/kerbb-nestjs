import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResourceService } from 'libs/services/resource.service';
import { Model } from 'mongoose';
import { CreateRoleDto } from 'src/role/dtos/create-role.dto';
import { Role } from 'src/role/entities/role.entitiy';
import { RoleFilterDto } from 'tools/dtos/role-filter.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}
  generalSearchQuery = {
    page: 1,
    size: 10,
    sort: 'ASC',
    sort_by: 'role_name',
  };
  async findAll(query?: RoleFilterDto) {
    const searchValue = await { ...this.generalSearchQuery, ...query };
    if (Object.keys(query).length !== 0) {
      return this.roleModel
        .find({})
        .limit(Math.max(0, searchValue.size))
        .skip(searchValue.size * (searchValue.page - 1))
        .sort([[`${searchValue.sort_by}`, searchValue.sort]])
        .exec();
    } else {
      return this.roleModel
        .find({})
        .limit(Math.max(0, searchValue.size))
        .skip(searchValue.size * (searchValue.page - 1))
        .sort([[`${searchValue.sort_by}`, searchValue.sort]])
        .exec();
    }
  }
  async findOne(id: string) {
    const role = await this.roleModel.findOne({ _id: id }).exec();
    if (!role) {
      throw new NotFoundException(`role ${id} was not found`);
    }
    return role;
  }
  create(createRoleDto: CreateRoleDto) {
    const role = new this.roleModel(createRoleDto);
    return role.save();
  }
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const existingRole = await this.roleModel
      .findOneAndUpdate({ _id: id }, { $set: updateRoleDto }, { new: true })
      .exec();

    if (!existingRole) {
      throw new NotFoundException(`Role ${id} was not found`);
    }
    return existingRole;
  }
  async remove(id: string) {
    const role = await this.findOne(id);
    return role.remove();
  }
  async removeAll(): Promise<any> {
    return await this.roleModel.deleteMany({}).exec();
  }
}
