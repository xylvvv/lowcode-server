import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RedisClientType } from 'redis';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import {
  CaptchaDto,
  LoginReqDto,
  OAuthConfigDto,
  OAuthDto,
  RegisterDto,
} from './auth.dto';
import { BusinessException } from '@lib/common/exceptions/business.exception';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { User } from 'apps/user-server/src/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(AuthController.name);

  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType;

  @Post('login')
  async login(@Body() loginReqDto: LoginReqDto) {
    const { username, password } = loginReqDto;
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new BusinessException(ERRNO_ENUM.USER_NOT_EXIST, '用户不存在');
    }
    if (!user.password) {
      throw new BusinessException('请使用其他方式登录！');
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

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const { username, captcha, password } = dto;
    const key = `captcha::register::${username}`;
    const verify = await this.redisClient.get(key);
    if (captcha !== verify) {
      throw new BusinessException('验证码有误');
    }
    const res = await this.userService.create({
      username,
      password: await bcrypt.hash(password, 10),
    } as User);
    await this.redisClient.del(key);
    return res;
  }

  @Post('captcha')
  async captcha(@Body() { username }: CaptchaDto) {
    const key = `captcha::register::${username}`;
    const exist = await this.redisClient.get(key);
    if (exist) {
      const ttl = await this.redisClient.ttl(key);
      if (ttl > 4 * 60) {
        throw new BusinessException('验证码已发送，请稍候再试');
      }
    }
    const captcha = Math.random().toString().slice(2, 8);
    await this.authService.sendEmailCaptcha(username, captcha);
    await this.redisClient.set(key, captcha, {
      EX: 5 * 60,
    });
    return true;
  }

  @Get('oauth/config')
  OAuthConfig(@Query() { type }: OAuthConfigDto) {
    if (type === 'github') {
      return {
        clientId: this.configService.get('GITHUB_CLIENT_ID'),
      };
    }
  }

  @Post('oauth')
  async OAuth(@Body() { type, code }: OAuthDto) {
    if (type === 'github') {
      try {
        const {
          avatar_url: picture,
          login,
          email,
          id,
        } = await this.authService.getGithubUser(code);
        const username = `github_${id}`;
        const payload: Partial<User> = {
          picture,
          username,
          nickname: email || login,
        };
        let user;
        try {
          user = await this.userService.create(payload as User);
        } catch (error) {
          if (error.errno === ERRNO_ENUM.USER_EXISTED) {
            user = await this.userService.findOne(username);
            await this.userService.update({
              id: user.id,
              ...payload,
            });
          }
        }
        return {
          access_token: this.authService.sign({ username, sub: user.id }),
        };
      } catch (error) {
        this.logger.error(error.message);
        throw new BusinessException('OAuth认证失败！');
      }
    }
  }
}
