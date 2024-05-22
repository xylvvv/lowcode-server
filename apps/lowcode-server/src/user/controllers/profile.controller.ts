import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';

import { User as UserEntity } from 'apps/user-server/src/user/user.entity';
import { UserService } from '../user.service';
import { User } from '../../decorators/user.decorator';
import { NewPasswordDto, UpdateProfileDto } from '../dtos/profile.dto';
import { BusinessException } from '@lib/common/exceptions/business.exception';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private userService: UserService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async profile(@User() user: UserEntity) {
    const res = await this.userService.findOne(user.username);
    return res ? new UserEntity(res) : null;
  }

  @Patch()
  update(@Body() dto: UpdateProfileDto, @User('userId') id: number) {
    return this.userService.update({
      ...dto,
      id,
    });
  }

  @Post('password')
  async newPassword(
    @Body() dto: NewPasswordDto,
    @User('userId') id: number,
    @User('username') username: string,
  ) {
    const { password, newPassword, verify } = dto;
    if (newPassword !== verify) {
      throw new BusinessException('两次输入的密码不一致');
    }
    const user = await this.userService.findOne(username);
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BusinessException(
        ERRNO_ENUM.PASSWORD_ERROR,
        '用户名密码不匹配',
      );
    }
    return this.userService.update({
      id,
      password: await bcrypt.hash(newPassword, 10),
    });
  }
}
