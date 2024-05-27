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
import * as bcrypt from 'bcrypt';

import { User as UserEntity } from 'apps/user-server/src/user/user.entity';
import { UserService } from '../user.service';
import { User } from '../../auth/decorators/user.decorator';
import { NewPasswordDto, UpdateProfileDto } from '../dtos/profile.dto';
import { BusinessException } from '@lib/common/exceptions/business.exception';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('profile')
@UseGuards(JwtAuthGuard)
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
    const { password, newPassword } = dto;
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
