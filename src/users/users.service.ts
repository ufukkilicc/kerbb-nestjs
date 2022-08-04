import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResourceService } from 'libs/services/resource.service';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entitiy/user.entitiy';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async findAll() {
    return await this.userModel
      .find({})
      .select('-user_password')
      .populate([
        { path: 'user_roles' },
        { path: 'user_groups', populate: 'group_roles' },
      ])
      .exec();
  }
  async findOne(id: string) {
    const user = await this.userModel
      .findOne({ _id: id })
      .select('-user_password')
      .populate([
        { path: 'user_roles' },
        { path: 'user_groups', populate: 'group_roles' },
      ])
      .exec();
    if (!user) {
      throw new NotFoundException(`User ${id} was not found`);
    }
    return user;
  }
  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    await user.save();
    return user.populate('user_roles');
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUserDto }, { new: true })
      .exec();

    if (!existingUser) {
      throw new NotFoundException(`User ${id} was not found`);
    }
    return existingUser;
  }
  async remove(id: string) {
    const user = await this.findOne(id);
    return user.remove();
  }
  async removeAll(): Promise<any> {
    return await this.userModel.deleteMany({}).exec();
  }
}
