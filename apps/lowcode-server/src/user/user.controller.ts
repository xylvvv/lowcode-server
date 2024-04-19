import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from 'apps/user/src/user.entity';
import { AuthService } from '../auth/auth.service';
import { LoginReqDto } from '../dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() loginReqDto: LoginReqDto) {
    const { username, password } = loginReqDto;
    let user;
    try {
      user = await this.userService.findOne(username, password);
    } catch (error) {
      user = await this.userService.createUser(loginReqDto as User);
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.authService.sign(payload),
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  find(@Request() req) {
    return req.user;
  }
}
