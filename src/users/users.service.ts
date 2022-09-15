import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResourceService } from 'libs/services/resource.service';
import { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entitiy/user.entitiy';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly emailService: EmailService,
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
      .findById(id)
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
  async findByEmail(userEmail: string) {
    const user = await this.userModel
      .findOne({ user_email: userEmail })
      .select('-user_password')
      .populate([
        { path: 'user_roles' },
        { path: 'user_groups', populate: 'group_roles' },
      ])
      .exec();
    if (!user) {
      throw new NotFoundException(`User ${userEmail} was not found`);
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
  async forgotPassword(userEmail: string) {
    const user = await this.findByEmail(userEmail);
    const reset_password_token = user.getResetPasswordTokenFromUser();

    await user.save();
    return await this.emailService.resetPasswordMail(userEmail, {
      user_name: user.user_name,
      user_reset_password_token: `http://localhost:3030/auth/reset-password?resetPasswordToken=${reset_password_token}`,
    });
  }
  async resetPassword(resetPasswordToken: string, userPassword: string) {
    const user = await this.userModel.findOne({
      user_reset_password_token: resetPasswordToken,
      user_reset_password_expire: { $gt: Date.now() },
    });
    if (!user) {
      throw new NotFoundException(`Token expired or does not exists`);
    }
    user.user_password = userPassword;
    user.user_reset_password_token = undefined;
    user.user_reset_password_expire = undefined;
    return await user.save();
  }
  async remove(id: string) {
    const user = await this.findOne(id);
    return user.remove();
  }
  async removeAll(): Promise<any> {
    return await this.userModel.deleteMany({}).exec();
  }
}
