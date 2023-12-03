import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entitiy/user.entitiy';
import { AuthLoginDto } from './dto/auth-login.dto';
const bcrypt = require('bcrypt');
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly usersService: UsersService,
  ) {}
  async login(authLoginDto: AuthLoginDto) {
    try {
      const existing_user = await this.userModel
        .findOne({
          user_email: authLoginDto.user_email,
        })
        .populate([
          { path: 'user_roles' },
          { path: 'user_groups', populate: 'group_roles' },
        ])
        .exec();
      if (existing_user) {
        let is_admin = false;
        existing_user.user_roles.forEach((role) => {
          if (role.role_name === 'Admin') {
            is_admin = true;
          }
        });
          const auth_json_webtoken = jwt.sign(
            { user: existing_user },
            process.env.JWT_TEXT,
          );
          const user = await this.userModel
            .findOne({
              user_email: existing_user.user_email,
            })
            .select('-user_password')
            .populate([
              { path: 'user_roles' },
              { path: 'user_groups', populate: 'group_roles' },
            ]);
          return await {
            user: user,
            token: auth_json_webtoken,
          };
        // if (is_admin) {
        //   const match = await bcrypt.compareSync(
        //     `${process.env.HASH_TEXT}${authLoginDto.user_password}`,
        //     existing_user.user_password,
        //   );
        //   if (match) {
        //     const auth_json_webtoken = jwt.sign(
        //       { user: existing_user },
        //       process.env.JWT_TEXT,
        //     );
        //     const user = await this.userModel
        //       .findOne({
        //         user_email: existing_user.user_email,
        //       })
        //       .select('-user_password')
        //       .populate([
        //         { path: 'user_roles' },
        //         { path: 'user_groups', populate: 'group_roles' },
        //       ]);
        //     return await {
        //       user: user,
        //       token: auth_json_webtoken,
        //     };
        //   } else {
        //     return new BadRequestException(`User password is not correct`);
        //   }
        // } else {
        //   return new UnauthorizedException(`Only admins can access this site`);
        // }
      } else {
        return new BadRequestException(
          `User with email ${authLoginDto.user_email} not found`,
        );
      }
    } catch (error) {
      (error);
    }
  }
  async updateProfile(userId, updateUserDto: UpdateUserDto) {
    (userId);
    const user = await this.usersService.findOne(userId);
    if (updateUserDto.user_name) {
      user.user_name = updateUserDto.user_name;
    }
    if (updateUserDto.user_surname) {
      user.user_surname = updateUserDto.user_surname;
    }
    if (updateUserDto.user_email) {
      user.user_email = updateUserDto.user_email;
    }
    user.save();
    return user;
  }
  async updatePassword(userId, body) {
    const user = await this.userModel
      .findById(userId)
      .populate([
        { path: 'user_roles' },
        { path: 'user_groups', populate: 'group_roles' },
      ])
      .exec();
    const match = await bcrypt.compareSync(
      `${process.env.HASH_TEXT}${body.old_password}`,
      user.user_password,
    );
    if (!match) {
      return new BadRequestException(`User password is not correct`);
    }
    if (body.new_password !== body.new_password_again) {
      return new BadRequestException(`Password are not a match`);
    }

    user.user_password = body.new_password;
    return await user.save();
  }
}
