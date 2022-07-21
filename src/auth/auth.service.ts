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
        if (is_admin) {
          const match = await bcrypt.compareSync(
            `${process.env.HASH_TEXT}${authLoginDto.user_password}`,
            existing_user.user_password,
          );
          if (match) {
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
          } else {
            return new BadRequestException(`User password is not correct`);
          }
        } else {
          return new UnauthorizedException(`Only admins can access this site`);
        }
      } else {
        return new BadRequestException(
          `User with email ${authLoginDto.user_email} not found`,
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
