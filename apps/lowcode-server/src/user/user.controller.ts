import { ErrorRes, SuccessRes } from '@lib/common/dto/res.dto';
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
    try {
      const res = await this.userService.findOne(username, password);
      let user;
      if (res) {
        user = res;
      } else {
        user = await this.userService.createUser(loginReqDto as User);
      }
      const payload = { username: user.username, sub: user.id };
      return new SuccessRes({
        access_token: this.authService.sign(payload),
      });
    } catch (error) {
      if (error instanceof Error) {
        return new ErrorRes({ message: error.message, errno: -1 });
      } else {
        return error;
      }
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  find(@Request() req) {
    return new SuccessRes(req.user);
  }
}
