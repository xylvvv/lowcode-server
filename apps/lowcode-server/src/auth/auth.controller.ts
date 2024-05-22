import { Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginReqDto } from './auth.dto';
import { BusinessException } from '@lib/common/exceptions/business.exception';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginReqDto: LoginReqDto) {
    const { username, password } = loginReqDto;
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new BusinessException(ERRNO_ENUM.USER_NOT_EXIST, '用户不存在');
    }
    if (password && !bcrypt.compareSync(password, user.password)) {
      throw new BusinessException(
        ERRNO_ENUM.PASSWORD_ERROR,
        '用户名密码不匹配',
      );
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.authService.sign(payload),
    };
  }
}
