import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Patch,
  Query,
  Headers,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return await this.authService.login(authLoginDto);
  }
  @Get('profile')
  async profile(@Req() request: Request) {
    const user_id = request['user'].user._id;
    return await this.usersService.findOne(user_id);
  }
  @Post('/forgot-password')
  forgotPassword(@Body('user_email') userEmail: string) {
    return this.usersService.forgotPassword(userEmail);
  }
  @Patch('/reset-password')
  resetPassword(
    @Query('resetPasswordToken') resetPasswordToken: string,
    @Body() body,
  ) {
    return this.usersService.resetPassword(
      resetPasswordToken,
      body.reset_password,
    );
  }
  @Patch('/update-profile')
  updateProfile(@Body() updateUserDto: UpdateUserDto, @Req() request: Request) {
    const user_id = request['user'].user._id;
    return this.authService.updateProfile(user_id, updateUserDto);
  }
  @Patch('/update-password')
  updatePassword(@Body() body, @Req() request: Request) {
    const user_id = request['user'].user._id;
    return this.authService.updatePassword(user_id, body);
  }
}
