import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Transporter } from 'nodemailer';
import axios from 'axios';
import * as querystring from 'querystring';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Inject('MAILER_TRANSPORTER')
  private readonly transporter: Transporter;

  sign(payload: any) {
    return this.jwtService.sign(payload);
  }

  verify(token = '') {
    try {
      return this.jwtService.verify(token.split(/\s+/)[1]);
    } catch (error) {
      return false;
    }
  }

  sendEmailCaptcha(to: string, captcha: string) {
    return this.transporter.sendMail({
      from: {
        name: '系统邮件',
        address: this.configService.get('MAILER_USER'),
      },
      to,
      subject: '注册验证码',
      html: `<p>验证码：${captcha}</p>`,
    });
  }

  async getGithubUser(code: string) {
    const { data } = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        code,
        client_id: this.configService.get('GITHUB_CLIENT_ID'),
        client_secret: this.configService.get('GITHUB_CLIENT_SECRET'),
      },
    );
    const { access_token } = querystring.parse(data);
    const { data: user } = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    return user;
  }
}
